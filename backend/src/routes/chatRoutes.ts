import express from 'express'
const router = express.Router();
import upload from '../middleware/multer';

import verifyToken from '../middleware/auth';

import { 
    createPersonalConversationCtrl, 
    getConversationByIdCtrl, 
    getUserConversationsCtrl,
    uploadFileCtrl
} from '../controller/conversationController';

router.post('/conversations', verifyToken, upload.none(), createPersonalConversationCtrl) // membuat chat baru 1 on 1
router.get('/conversations', verifyToken, getUserConversationsCtrl) // semua chat berdasarkan yang login
router.get('/conversations/:id', verifyToken, getConversationByIdCtrl) // detail chatnya
router.post('/upload', verifyToken, upload.single('file'), uploadFileCtrl)

export default router