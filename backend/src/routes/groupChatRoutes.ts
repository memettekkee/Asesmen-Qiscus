import express from 'express';
import verifyToken from '../middleware/auth';
import upload from '../middleware/multer';

import { 
    createGroupConversationCtrl,
    updateConversationCtrl,
    deleteConversationCtrl,
    updateParticipantRoleCtrl
} from '../controller/groupConversationController';

const router = express.Router()

router.post('/groups', verifyToken, upload.none(), createGroupConversationCtrl) // Bikin grup baru
router.put('/conversations/:id', verifyToken, upload.none(), updateConversationCtrl) // edit info grup
router.delete('/conversations/:id', verifyToken, deleteConversationCtrl) // hapus grup, hanya yg buat grup yg bisa
router.put('/conversations/:conversationId/participants/:participantId/role', verifyToken, upload.none(), updateParticipantRoleCtrl); // Membuat anggota lain jadi admin (hanya admin)

export default router