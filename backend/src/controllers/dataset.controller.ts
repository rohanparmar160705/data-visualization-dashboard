import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { parseFile } from '../utils/fileparser';

const prisma = new PrismaClient();

export const uploadDataset = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { name } = req.body;
    const file = req.file;

    // Parse file
    const { data, columnNames } = await parseFile(file);

    if (data.length === 0) {
      return res.status(400).json({ error: 'File contains no data' });
    }

    // Create dataset
    const dataset = await prisma.dataset.create({
      data: {
        name: name || file.originalname,
        filename: file.originalname,
        uploadedBy: req.user!.id,
        rowCount: data.length,
        columnNames,
      },
    });

    // Create data records in batches
    const batchSize = 500;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      await prisma.dataRecord.createMany({
        data: batch.map((row) => ({
          datasetId: dataset.id,
          rowData: row,
        })),
      });
    }

    res.status(201).json({ dataset });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload dataset' });
  }
};

export const getDatasets = async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = req.user!.role === 'ADMIN';
    
    const datasets = await prisma.dataset.findMany({
      where: isAdmin ? {} : { uploadedBy: req.user!.id },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ datasets });
  } catch (error: any) {
    console.error('Get datasets error:', error);
    res.status(500).json({ error: 'Failed to fetch datasets' });
  }
};

export const getDataset = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const dataset = await prisma.dataset.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    if (dataset.uploadedBy !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ dataset });
  } catch (error: any) {
    console.error('Get dataset error:', error);
    res.status(500).json({ error: 'Failed to fetch dataset' });
  }
};

export const getDatasetRecords = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { page = '1', limit = '10', search = '', sortBy, sortOrder = 'asc' } = req.query;

    const dataset = await prisma.dataset.findUnique({ where: { id } });

    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    if (dataset.uploadedBy !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause for search
    const whereClause: any = { datasetId: id };
    
    if (search) {
      whereClause.OR = dataset.columnNames.map((col : any) => ({
        rowData: {
          path: [col],
          string_contains: search,
        },
      }));
    }

    const [records, total] = await Promise.all([
      prisma.dataRecord.findMany({
        where: whereClause,
        skip,
        take: limitNum,
        orderBy: sortBy
          ? { rowData: { path: [sortBy as string], sort: sortOrder as any } }
          : { createdAt: 'desc' },
      }),
      prisma.dataRecord.count({ where: whereClause }),
    ]);

    res.json({
      records: records.map((r : any) => ({ id: r.id, ...r.rowData })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Get dataset records error:', error);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
};

export const deleteDataset = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const dataset = await prisma.dataset.findUnique({ where: { id } });

    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    if (dataset.uploadedBy !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.dataset.delete({ where: { id } });

    res.json({ message: 'Dataset deleted successfully' });
  } catch (error: any) {
    console.error('Delete dataset error:', error);
    res.status(500).json({ error: 'Failed to delete dataset' });
  }
};