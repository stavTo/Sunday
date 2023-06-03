export const utilService = {
	makeId,
	makeLorem,
	getRandomIntInclusive,
	debounce,
	randomPastTime,
	saveToStorage,
	loadFromStorage,
	getRandomColor,
	hexToRgba,
}

function makeId(length = 6) {
	var txt = ''
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

	for (var i = 0; i < length; i++) {
		txt += possible.charAt(Math.floor(Math.random() * possible.length))
	}

	return txt
}

function makeLorem(size = 100) {
	var words = [
		'The sky',
		'above',
		'the port',
		'was',
		'the color of television',
		'tuned',
		'to',
		'a dead channel',
		'.',
		'All',
		'this happened',
		'more or less',
		'.',
		'I',
		'had',
		'the story',
		'bit by bit',
		'from various people',
		'and',
		'as generally',
		'happens',
		'in such cases',
		'each time',
		'it',
		'was',
		'a different story',
		'.',
		'It',
		'was',
		'a pleasure',
		'to',
		'burn',
	]
	var txt = ''
	while (size > 0) {
		size--
		txt += words[Math.floor(Math.random() * words.length)] + ' '
	}
	return txt
}

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}

function randomPastTime() {
	const HOUR = 1000 * 60 * 60
	const DAY = 1000 * 60 * 60 * 24
	const WEEK = 1000 * 60 * 60 * 24 * 7

	const pastTime = getRandomIntInclusive(HOUR, WEEK)
	return Date.now() - pastTime
}

function debounce(func, timeout = 300) {
	let timer
	return (...args) => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			func.apply(this, args)
		}, timeout)
	}
}

function saveToStorage(key, value) {
	localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
	const data = localStorage.getItem(key)
	return data ? JSON.parse(data) : undefined
}

function getRandomColor() {
	let letters = '0123456789ABCDEF'
	let color = '#'
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	return color
}

function hexToRgba(hex, alpha = 1) {
	// Remove the '#' character from the beginning of the hex code
	hex = hex.replace('#', '')

	// Extract the individual color components from the hex code
	const r = parseInt(hex.substr(0, 2), 16)
	const g = parseInt(hex.substr(2, 2), 16)
	const b = parseInt(hex.substr(4, 2), 16)

	// Return the RGB values as an object
	return `rgba(${r},${g},${b},${alpha})`
	return { r, g, b }
}
