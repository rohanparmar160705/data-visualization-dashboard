import { Router } from 'express';
import multer from 'multer';
import {
  uploadDataset,
  getDatasets,
  getDataset,
  getDatasetRecords,
  deleteDataset,
} from '../controllers/dataset.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(csv|xlsx|xls)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and Excel files are allowed'));
    }
  },
});

router.use(authenticateToken);

router.post('/upload', upload.single('file'), uploadDataset);
router.get('/', getDatasets);
router.get('/:id', getDataset);
router.get('/:id/data', getDatasetRecords);
router.delete('/:id', deleteDataset);

export default router;