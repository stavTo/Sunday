import express from 'express'
import { getUser, getUsers, deleteUser, updateUser } from './user.controller.mjs'

const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export const userRoutes = router
