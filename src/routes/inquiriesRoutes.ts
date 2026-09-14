import { Router } from 'express';
import {
    getAllInquiries,
    getInquiryById,
    createInquiry,
    updateInquiryStatus
} from '../controllers/inquiriesController';

const router = Router();

router.get('/', getAllInquiries);
router.get('/:id', getInquiryById);
router.post('/', createInquiry);
router.patch('/:id', updateInquiryStatus);

export default router;