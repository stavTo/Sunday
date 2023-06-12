import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'

import { userService } from '../user/user.service.mjs'
import { logger } from '../../services/logger.service.mjs'
import { dbService } from '../../services/db.service.mjs'
import mongodb from 'mongodb'
const { ObjectId } = mongodb

const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

export const authService = {
    signup,
    login,
    getLoginToken,
    validateToken,
    changePassword
}

async function login(email, password) {
    logger.debug(`auth.service - login with email: ${email}`)

    const user = await userService.getByEmail(email)
    if (!user) throw new Error('Invalid email or password')

    const match = await bcrypt.compare(password, user.password)
    if (!match) throw new Error('Invalid email or password')

    delete user.password
    user._id = user._id.toString()
    return user
}

async function signup({ email, password, fullname, imgUrl }) {
    const saltRounds = 10

    logger.debug(`auth.service - signup with email: ${email}, fullname: ${fullname}`)
    if (!email || !password || !fullname) throw new Error('Missing required signup information')

    const userExist = await userService.getByEmail(email)
    if (userExist) throw new Error('Email already taken')

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ email, password: hash, fullname, imgUrl })
}

function getLoginToken(user) {
    const userInfo = { _id: user._id, fullname: user.fullname }
    return cryptr.encrypt(JSON.stringify(userInfo))
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

async function changePassword(userId, newPass) {
    try {
        const saltRounds = 10

        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ _id: ObjectId(userId) })

        const hash = await bcrypt.hash(newPass, saltRounds)
        user.password = hash
        delete user._id

        await collection.updateOne({ _id: ObjectId(userId) }, { $set: user })

    } catch (err) {
        throw err
    }
}