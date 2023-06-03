import { storageService } from './async-storage.service'
import { httpService } from './http.service'
import { DEFAULT_USER } from '../assets/icons/icons'
import { utilService } from './util.service'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'

export const userService = {
	login,
	logout,
	signup,
	getLoggedInUser,
	saveLocalUser,
	getUsers,
	getById,
	remove,
	update,
	changeScore,
	getDemoUsers,
	getEmptyUser,
}

window.userService = userService

function getUsers() {
	return storageService.query('user')
	// return httpService.get(`user`)
}

async function getById(userId) {
	const user = await storageService.get('user', userId)
	// const user = await httpService.get(`user/${userId}`)
	return user
}

function remove(userId) {
	return storageService.remove('user', userId)
	// return httpService.delete(`user/${userId}`)
}

async function update({ _id, score }) {
	const user = await storageService.get('user', _id)
	user.score = score
	await storageService.put('user', user)

	// const user = await httpService.put(`user/${_id}`, {_id, score})
	// Handle case in which admin updates other user's details
	if (getLoggedInUser()._id === user._id) saveLocalUser(user)
	return user
}

async function login(userCred) {
	const users = await storageService.query('user')
	const user = users.find(user => user.username === userCred.username)
	// const user = await httpService.post('auth/login', userCred)
	if (user) {
		return saveLocalUser(user)
	}
}
async function signup(userCred) {
	userCred.score = 10000
	if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
	const user = await storageService.post('user', userCred)
	// const user = await httpService.post('auth/signup', userCred)
	return saveLocalUser(user)
}
async function logout() {
	sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
	// return await httpService.post('auth/logout')
}

async function changeScore(by) {
	const user = getLoggedInUser()
	if (!user) throw new Error('Not loggedIn')
	user.score = user.score + by || by
	await update(user)
	return user.score
}

function saveLocalUser(user) {
	user = { _id: user._id, fullname: user.fullname, imgUrl: user.imgUrl, score: user.score }
	sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
	return user
}

function getLoggedInUser() {
	return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function getDemoUsers(filter = '') {
	const users = [
		getEmptyUser('u101', 'Ido Kadosh'),
		getEmptyUser('u102', 'Roni Yerushalmi'),
		getEmptyUser('u103', 'Stav Tohami'),
		getEmptyUser('u104', 'Eyal Golan'),
		getEmptyUser('u105', 'Steve Jobs'),
	]

	const regex = new RegExp(filter, 'i')
	return users.filter(user => regex.test(user.fullname))
}

function getEmptyUser(_id = '', fullname = '', imgUrl = DEFAULT_USER) {
	return {
		_id,
		fullname,
		imgUrl,
	}
}

// ;(async ()=>{
//     await userService.signup({fullname: 'Puki Norma', username: 'puki', password:'123',score: 10000, isAdmin: false})
//     await userService.signup({fullname: 'Master Adminov', username: 'admin', password:'123', score: 10000, isAdmin: true})
//     await userService.signup({fullname: 'Muki G', username: 'muki', password:'123', score: 10000})
// })()
