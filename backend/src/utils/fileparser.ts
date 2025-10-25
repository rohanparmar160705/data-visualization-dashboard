import * as XLSX from 'xlsx';
import csvParser from 'csv-parser';
import { Readable } from 'stream';

interface ParsedData {
  data: Record<string, any>[];
  columnNames: string[];
}

export const parseFile = async (file: Express.Multer.File): Promise<ParsedData> => {
  const extension = file.originalname.split('.').pop()?.toLowerCase();

  if (extension === 'csv') {
    return parseCSV(file.buffer);
  } else if (['xlsx', 'xls'].includes(extension || '')) {
    return parseExcel(file.buffer);
  } else {
    throw new Error('Unsupported file format. Please upload CSV or Excel files.');
  }
};

const parseCSV = async (buffer: Buffer): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    const data: Record<string, any>[] = [];
    const stream = Readable.from(buffer);

    stream
      .pipe(csvParser())
      .on('data', (row) => {
        // Convert string numbers to actual numbers
        const cleanedRow: Record<string, any> = {};
        Object.keys(row).forEach((key) => {
          const value = row[key];
          const trimmedKey = key.trim();
          
          // Try to parse as number
          const numValue = parseFloat(value);
          if (!isNaN(numValue) && value.trim() !== '') {
            cleanedRow[trimmedKey] = numValue;
          } else {
            cleanedRow[trimmedKey] = value;
          }
        });
        data.push(cleanedRow);
      })
      .on('end', () => {
        const columnNames = data.length > 0 ? Object.keys(data[0]) : [];
        resolve({ data, columnNames });
      })
      .on('error', reject);
  });
};

const parseExcel = (buffer: Buffer): ParsedData => {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  const data: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet);
  const columnNames = data.length > 0 ? Object.keys(data[0]) : [];

  return { data, columnNames };
};