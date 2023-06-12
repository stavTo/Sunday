import express from 'express'
import {login, signup, logout , changePassword} from './auth.controller.mjs'

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/logout', logout)
router.post('/change', changePassword)

export const authRoutes = router