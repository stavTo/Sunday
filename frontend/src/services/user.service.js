import { httpService } from './http.service'
import { DEFAULT_USER } from '../assets/icons/icons'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'
const BASE_URL = 'user/'

export const userService = {
	login,
	logout,
	signup,
	getLoggedInUser,
	saveLocalUser,
	getUsers,
	getById,
	remove,
	getEmptyUser,
	getEmptyCredentials,
	changePassword,
	getDefaultModalData,
	updateUser,
}

function getUsers() {
	return httpService.get(BASE_URL)
}

async function getById(userId) {
	return httpService.get(BASE_URL + userId)
}

function remove(userId) {
	return httpService.delete(BASE_URL + userId)
}

async function login(userCred) {
	try {
		const user = await httpService.post('auth/login', userCred)
		if (user) {
			return saveLocalUser(user)
		}
	} catch (err) {
		throw err
	}
}

async function signup(userCred) {
	if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
	const user = await httpService.post('auth/signup', userCred)
	return saveLocalUser(user)
}

async function logout() {
	sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
	return await httpService.post('auth/logout')
}

function saveLocalUser(user) {
	user = {
		_id: user._id,
		fullname: user.fullname,
		imgUrl: user.imgUrl,
		email: user.email || '',
		title: user.title || '',
		phone: user.phone || '',
		skype: user.skype || '',
		location: user.location || '',
	}
	sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
	return user
}

function getLoggedInUser() {
	return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function getEmptyUser(_id = '', fullname = '', imgUrl = DEFAULT_USER, email = '') {
	return {
		_id,
		fullname,
		imgUrl,
		email,
	}
}

function getEmptyCredentials(fullname = '', email = '', password = '') {
	return {
		fullname,
		email,
		password,
	}
}

async function changePassword(credentials) {
	return httpService.post('auth/change', credentials)
}

function getDefaultModalData() {
	const user = getLoggedInUser()

	return {
		title: user.title || '',
		email: user.email || '',
		phone: user.phone || '',
		skype: user.skype || '',
		location: user.location || '',
	}
}

async function updateUser(userToSave) {
	return httpService.put(BASE_URL + 'update', userToSave)
}
