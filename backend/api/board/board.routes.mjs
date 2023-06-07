import express from 'express'
import { log } from '../../middlewares/logger.middleware.mjs'
import { getBoards, getBoardById, addBoard, updateBoard, removeBoard } from './board.controller.mjs'

const router = express.Router()

router.get('/', log, getBoards)
router.get('/:id', getBoardById)
router.post('/', addBoard)
router.put('/:id', updateBoard)
router.delete('/:id', removeBoard)
// router.delete('/:id', requireAuth, requireAdmin, removeBoard)

// router.post('/:id/msg', addBoardMsg)
// router.delete('/:id/msg/:msgId', removeBoardMsg)

export const boardRoutes = router
