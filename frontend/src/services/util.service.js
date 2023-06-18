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
	timeStampToDate,
	millisecondsToDays,
	getBlessingByTime,
	fractionToPercent,
	darkenHexColor,
	isValidTimestamp,
	timeSince,
	getTimelineRange,
}

function getTimelineRange(timeline) {
	// Used by activity-preview, unlike "getTimelineRange" at timeline-summary.
	const startMonth = timeStampToDate(timeline.startDate).slice(0, 3)
	const endMonth = timeStampToDate(timeline.endDate).slice(0, 3)

	const startDay = timeStampToDate(timeline.startDate).slice(4)
	const endDay = timeStampToDate(timeline.endDate).slice(4)

	if (startMonth === endMonth) {
		return ` ${startMonth} ${startDay}-${endDay}`
	} else {
		return `${startMonth} ${startDay} - ${endMonth} ${endDay}`
	}
}

function timeSince(timeStamp) {
	let now = new Date(),
		secondsPast = (now.getTime() - timeStamp) / 1000
	if (secondsPast < 60) {
		return parseInt(secondsPast) + 's'
	}
	if (secondsPast < 3600) {
		return parseInt(secondsPast / 60) + 'm'
	}
	if (secondsPast <= 86400) {
		return parseInt(secondsPast / 3600) + 'h'
	}
	if (secondsPast > 86400) {
		const date = new Date(timeStamp)
		const day = date.getDate()
		const month = date
			.toDateString()
			.match(/ [a-zA-Z]*/)[0]
			.replace(' ', '')
		const year = date.getFullYear() === now.getFullYear() ? '' : ' ' + timeStamp.getFullYear()
		return day + ' ' + month + year
	}
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
	// const DAY = 1000 * 60 * 60 * 24
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
	const colors = ['#037f4c', '#00c875', '#9cd326', '#cab641', '#ffcb00', '#784bd1', '#a25ddc', '#0086c0', '#66ccff',
		'#bb3354', '#e2445c', '#ff158a', '#ff5ac4', '#ff642e', '#fdab3d',
		'#7f5347', '#c4c4c4', '#808080']
	return colors[getRandomIntInclusive(0, colors.length - 1)]
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
}

export function isValidTimestamp(timestamp) {
	return !isNaN(new Date(timestamp).getTime())
}

export function timeStampToDate(timeStamp) {
	const timelineToSave = new Date(timeStamp).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
	})
	return timelineToSave
}

export function millisecondsToDays(ms) {
	return Math.floor(ms / 86400000) //num of ms in day
}

export function getBlessingByTime() {
	const date = new Date()
	const currentHour = date.getHours()

	if (currentHour >= 5 && currentHour < 12) {
		return 'Good morning'
	} else if (currentHour >= 12 && currentHour < 18) {
		return 'Good afternoon'
	} else if (currentHour >= 18 && currentHour < 21) {
		return 'Good evening'
	} else {
		return 'Good night'
	}
}

function fractionToPercent(fractionString) {
	const fractionNumbers = fractionString.split('/')
	return (fractionNumbers[0] / fractionNumbers[1]) * 100
}

export function darkenHexColor(color) {
	// Remove the '#' symbol from the hex color
	const hexColor = color.replace('#', '')

	// Convert the hex color to RGB values
	const red = parseInt(hexColor.substr(0, 2), 16)
	const green = parseInt(hexColor.substr(2, 2), 16)
	const blue = parseInt(hexColor.substr(4, 2), 16)

	// Calculate the darker RGB values
	const darkerRed = Math.floor(red * 0.8)
	const darkerGreen = Math.floor(green * 0.8)
	const darkerBlue = Math.floor(blue * 0.8)

	// Convert the darker RGB values back to a hex color
	const darkerHexColor = `#${darkerRed.toString(16).padStart(2, '0')}${darkerGreen
		.toString(16)
		.padStart(2, '0')}${darkerBlue.toString(16).padStart(2, '0')}`
	return darkerHexColor
}
