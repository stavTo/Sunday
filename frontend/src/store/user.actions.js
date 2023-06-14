import { userService } from '../services/user.service.js'
import { store } from '../store/store.js'

import { REMOVE_USER, SET_USER, SET_USERS } from './user.reducer.js'

export async function loadUsers() {
	try {
		const users = await userService.getUsers()
		store.dispatch({ type: SET_USERS, users })
	} catch (err) {
		throw err
	}
}

export async function removeUser(userId) {
	try {
		await userService.remove(userId)
		store.dispatch({ type: REMOVE_USER, userId })
	} catch (err) {
		throw err
	}
}

export async function login(credentials) {
	try {
		const user = await userService.login(credentials)
		store.dispatch({
			type: SET_USER,
			user,
		})
		return user
	} catch (err) {
		throw err
	}
}

export async function signup(credentials) {
	try {
		const user = await userService.signup(credentials)
		store.dispatch({
			type: SET_USER,
			user,
		})
		return user
	} catch (err) {
		throw err
	}
}

export async function logout() {
	try {
		await userService.logout()
		store.dispatch({
			type: SET_USER,
			user: null,
		})
	} catch (err) {
		throw err
	}
}

export async function updateUser(userToSave) {
	try {
		const user = await userService.updateUser(userToSave)
		userService.saveLocalUser(user)
		console.log('user', user)
		store.dispatch({
			type: SET_USER,
			user,
		})
		return user
	} catch (err) {
		throw err
	}
}
