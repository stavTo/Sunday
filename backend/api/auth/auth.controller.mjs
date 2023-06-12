import { authService } from './auth.service.mjs'
import { logger } from '../../services/logger.service.mjs'
import { userService } from '../user/user.service.mjs'
import bcrypt from 'bcrypt'

export async function login(req, res) {
    const { email, password } = req.body
    try {
        const user = await authService.login(email, password)
        const loginToken = authService.getLoginToken(user)
        logger.info('User login: ', user)
        res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })
        res.json(user)
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(401).send('Failed to Login')
    }
}

export async function signup(req, res) {
    try {
        const credentials = req.body
        // Never log passwords
        const account = await authService.signup(credentials)
        logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
        const user = await authService.login(credentials.email, credentials.password)
        logger.info('User signup:', user)
        const loginToken = authService.getLoginToken(user)
        res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })
        res.json(user)
    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(400).send('Mail is already used')
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(400).send('Failed to logout')
    }
}

export async function changePassword(req, res) {
    const { userId, currPass, newPass } = req.body
    try {
        const user = await userService.getById(userId)
        if (!user) return res.status(400).send('User not found')

        const loggedinUser = authService.validateToken(req.cookies.loginToken)
        if (loggedinUser._id !== userId) return res.status(400).send('User not logged in')

        const match = await bcrypt.compare(currPass, user.password)
        if (!match) return res.status(400).send('User not found')

        await authService.changePassword(userId, newPass)
        return res.send({ msg: 'Changed password successfully' })

    } catch (err) {
        console.log(err)
        res.status(400).send('User not logged in')
    }




}

