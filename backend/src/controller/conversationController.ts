import express from 'express'
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

import { 
    findExistingPersonalConversation,
    createPersonalConversation,
    getUserConversations,
    getConversationById
} from '../model/conversationModel'

import { userById } from '../model/userModel'

export const createPersonalConversationCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { receiverId } = req.body
        const currentUserId = req.user?.id;

        if (!receiverId) {
            res.status(400).json({
                error: true,
                message: "Please input receiver ID !"
            })
            return
        }

        const receiver = await userById(receiverId)
        if (!receiver) {
            res.status(404).json({
                error: true,
                message: "Receiver ID didn't exist !"
            })
            return
        }

        if (currentUserId === receiverId) {
            res.status(400).json({
                error: true,
                message: "Can't start new chat with same person !"
            })
            return
        }

        const existingConversation = await findExistingPersonalConversation(
            currentUserId as string,
            receiverId
        )

        if (existingConversation) {
            res.status(200).json({
                error: false,
                message: "Conversation exist !",
                conversation: existingConversation
            });
            return
        }

        const newConversation = await createPersonalConversation(
            currentUserId as string,
            receiverId
        )

        res.status(201).json({
            error: false,
            message: "New conversation added !",
            conversation: newConversation
        });
        return 
    } catch (e: any) {
        res.status(500).json({
            error: true,
            message: e.message || "Server error"
        });
        return 
    }
}

export const getUserConversationsCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const userId = req.user?.id;

        const conversations = await getUserConversations(userId as string)

        const processedConversations = conversations.map(conv => {
            if (!conv.isGroup) {
                const otherParticipant = conv.participants.find(
                    p => p.userId !== userId
                );
                
                return {
                    ...conv,
                    name: otherParticipant?.user.name || "Unknown",
                    otherUser: otherParticipant?.user || null,
                    lastMessage: conv.messages[0] || null
                };
            }
            
            return {
                ...conv,
                lastMessage: conv.messages[0] || null
            };
        });
        res.status(200).json({
            error: false,
            message: "Success getting all conversation with !",
            conversations: processedConversations
        });
        return 
    } catch (e: any) {
        res.status(500).json({
            error: true,
            message: e.message || "Server error"
        });
        return
    }
}

export const getConversationByIdCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params
        const userId = req.user?.id;

        const conversation = await getConversationById(id, userId as string)

        if (!conversation) {
            res.status(404).json({
                error: true,
                message: "Conversation not found or you do not have access !"
            });
            return
        }

        if (!conversation.isGroup) {
            const otherParticipant = conversation.participants.find(
                p => p.userId !== userId
            );
            
            res.status(200).json({
                error: false,
                message: "Conversation founded !",
                conversation: {
                    ...conversation,
                    otherUser: otherParticipant?.user || null
                }
            });
            return
        }
        res.status(200).json({
            error: false,
            message: "Conversation founded !",
            conversation: conversation
        })
    } catch (e: any) {
        res.status(500).json({
            error: true,
            message: e.message || "Server error"
        });
        return 
    }
}

export const uploadFileCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        if (!req.file) {
            res.status(400).json({
                error: true,
                message: "No file uploaded"
            });
            return;
        }
        

        const file = req.file;
        const fileExtension = path.extname(file.originalname);
        const fileName = `${uuidv4()}${fileExtension}`;

        let fileType = 'FILE';
        if (file.mimetype.startsWith('image/')) fileType = 'IMAGE';
        else if (file.mimetype.startsWith('video/')) fileType = 'VIDEO';
        else if (file.mimetype.startsWith('audio/')) fileType = 'AUDIO';

        const uploadsDir = path.join(process.cwd(), 'src', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const uploadPath = path.join(uploadsDir, fileName);
        fs.writeFileSync(uploadPath, file.buffer);

        const fileUrl = `https://qiscus.muhammadmet.biz.id/uploads/${fileName}`;

        res.status(200).json({
            success: true,
            fileUrl,
            fileType,
            fileName: file.originalname,
            fileSize: file.size
        });

    } catch (error: any) {
        res.status(500).json({
            error: true,
            message: error.message || "Upload failed"
        });
    }
};