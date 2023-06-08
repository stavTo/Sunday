// import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'
import { utilService } from './util.service.js'

// import { DEFAULT_USER } from '../assets/icons/icons.js'
// import stavImg from '../assets/img/stav-user.jpeg'
// import idoImg from '../assets/img/ido-user.jpeg'
// import roniImg from '../assets/img/roni-img.jpg'

const STORAGE_KEY = 'board'
const BASE_URL = 'board/'

export const boardService = {
	query,
	getById,
	save,
	remove,
	getEmptyBoard,
	saveTask,
	addTask,
	getEmptyTask,
	addGroup,
	getEmptyGroup,
	removeTask,
	addTaskToFirstGroup,
	getDefaultFilter,
	getEmptyLabel,
	updateLabels,
	getTaskById,
	getGroupByTask,
	getGroupById,
	updateGroup,
	removeGroup,
	getBoardMembers,
	duplicateGroup,
	duplicateTask,
	getGroupDateSummary,
	groupHasDate,
	getStatusLabelById,
	getEmptyActivity,
}

async function query(filterBy = { txt: '', price: 0 }) {
	return httpService.get(BASE_URL, filterBy)
}

function getById(boardId, filter = {}) {
	return httpService.get(BASE_URL + boardId, filter)
}

async function remove(boardId) {
	return httpService.delete(BASE_URL + boardId)
}

async function save(board) {
	let savedBoard
	if (board._id) {
		savedBoard = await httpService.put(BASE_URL + board._id, board)
	} else {
		savedBoard = await httpService.post(BASE_URL, board)
	}
	return savedBoard
}

// async function addBoardMsg(boardId, txt) {
// 	const savedMsg = await httpService.post(`board/${boardId}/msg`, { txt })
// 	return savedMsg
// }

function getEmptyBoard() {
	return {
		title: '',
		isStarred: false,
		description: '',
		archivedAt: null,
		createdBy: { _id: '', fullname: '', imgUrl: '' },
		style: {},
		members: [],
		groups: [],
		cmpsOrder: [
			{ id: utilService.makeId(), cmpName: 'ownerPicker', defaultWidth: '85px', minWidth: '85px' },
			{ id: utilService.makeId(), cmpName: 'statusPicker', defaultWidth: '150px', minWidth: '50px' },
			{ id: utilService.makeId(), cmpName: 'priorityPicker', defaultWidth: '150px', minWidth: '50px' },
			{ id: utilService.makeId(), cmpName: 'timelinePicker', defaultWidth: '150px', minWidth: '70px' },
			{ id: utilService.makeId(), cmpName: 'collaboratorPicker', defaultWidth: '150px', minWidth: '100px' },
			{ id: utilService.makeId(), cmpName: 'datePicker', defaultWidth: '100px', minWidth: '50px' },
		],
		statusLabels: [
			{ id: 'sl100', title: 'Done', color: '#00C875' },
			{ id: 'sl101', title: 'Working on it', color: '#fdab3d' },
			{ id: 'sl102', title: 'Stuck', color: '#e2445c' },
			{ id: 'sl103', title: 'Not Started', color: '#c4c4c4' },
		],
		priorityLabels: [
			{ id: 'pl100', title: 'Critical', color: '#333333' },
			{ id: 'pl101', title: 'High', color: '#401694' },
			{ id: 'pl102', title: 'Medium', color: '#5559df' },
			{ id: 'pl103', title: 'Low', color: '#579bfc' },
			{ id: 'pl104', title: '', color: '#c4c4c4' },
		],
		activities: [],
	}
}

function getEmptyTask(title = '') {
	return {
		id: '',
		title,
		status: 'sl104',
		priority: 'pl104',
		comments: [],
		collaborators: [],
		dueDate: null,
		// timeline: {
		// 	startDate: null,
		// 	endDate: null
		// },
		owner: {
			_id: '',
			username: '',
			fullname: '',
			imgUrl: 'https://asset.cloudinary.com/diyikz4gq/3a419ce071a927e482ec39a775a4677d',
		},
	}
}

function getEmptyGroup(title = 'New Group', tasks = [], style = { color: utilService.getRandomColor() }, id = '') {
	return {
		id,
		title,
		tasks,
		style,
	}
}

function getEmptyLabel() {
	return {
		id: utilService.makeId(),
		title: '',
		color: '#c4c4c4',
	}
}

function getStatusLabelById(board, labelId) {
	return board.statusLabels.find(label => label.id === labelId)
}

function getBoardMembers(board, filter = '') {
	const members = board.members
	const regex = new RegExp(filter, 'i')
	return members.filter(member => regex.test(member.fullname))
}

async function addGroup(boardId, pushToTop, activity = '') {
	const newGroup = getEmptyGroup()
	newGroup.id = utilService.makeId()
	try {
		const action = {
			description: 'Added group',
			groupTitle: 'New Group',
			groupColor: newGroup.style.color,
			type: 'Created group',
		}


		const board = await getById(boardId)
		pushToTop ? board.groups.push(newGroup) : board.groups.unshift(newGroup)

		const activity = getEmptyActivity(board, newGroup.id, action)
		board.activities.unshift(activity)


		await save(board)
		return board
	} catch (err) {
		throw err
	}
}

async function duplicateGroup(boardId, group, activity = '') {
	const newGroup = structuredClone(group)
	const newGroupChangeTaskId = {
		...newGroup,
		id: utilService.makeId(),
		tasks: newGroup.tasks.map(t => ({ ...t, id: utilService.makeId() })),
	}
	try {
		const board = await getById(boardId)
		const idx = board.groups.findIndex(g => g.id === group.id)
		board.groups.splice(idx, 0, newGroupChangeTaskId)
		await save(board)
		return board
	} catch (err) {
		throw err
	}
}

async function duplicateTask(boardId, group, task, boolean) {
	const newTask = boolean ? { ...task } : getEmptyTask('New task')
	newTask.id = utilService.makeId()
	try {
		const board = await getById(boardId)
		const currGroup = board.groups.find(g => g.id === group.id)
		const idx = currGroup.tasks.findIndex(t => t.id === task.id)
		currGroup.tasks.splice(idx + 1, 0, newTask)
		await save(board)
		return board
	} catch (err) {
		throw err
	}
}

async function updateLabels(board, labelsName, labels) {
	const boardToSave = structuredClone(board)
	boardToSave[labelsName] = labels
	try {
		await save(boardToSave)
		return boardToSave
	} catch (err) {
		throw err
	}
}

function getTaskById(board, groupId, taskId) {
	const newBoard = structuredClone(board)
	const group = newBoard.groups.find(g => g.id === groupId)
	const task = group.tasks.find(t => t.id === taskId)
	return task
}

function getGroupByTask(board, taskId) {
	const newBoard = structuredClone(board)
	return newBoard.groups.find(g => g.tasks.some(t => t.id === taskId))
}

function getGroupById(board, groupId) {
	const newBoard = structuredClone(board)
	return newBoard.groups.find(group => group.id === groupId)
}

async function saveTask(boardId, groupId, task, action = {}) {
	try {
		const board = await getById(boardId)
		board.groups = board.groups.map(group =>
			group.id !== groupId ? group : { ...group, tasks: group.tasks.map(t => (t.id === task.id ? task : t)) }
		)
		const activity = getEmptyActivity(board, task.id, action)
		board.activities.unshift(activity)

		await save(board)
		return board
	} catch (err) {
		throw err
	}
}

async function addTask(boardId, groupId, task, action = {}) {
	try {
		const board = await getById(boardId)
		task.id = utilService.makeId()
		board.groups = board.groups.map(group =>
			group.id !== groupId ? group : { ...group, tasks: [...group.tasks, task] }
		)

		const activity = getEmptyActivity(board, task.id, action)
		board.activities.unshift(activity)

		await save(board)
		return board
	} catch (err) {
		throw err
	}
}

async function removeTask(boardId, taskId, action = {}) {
	try {
		console.log(taskId)
		const board = await getById(boardId)
		board.groups = board.groups.map(group => ({ ...group, tasks: group.tasks.filter(t => t.id !== taskId) }))

		console.log(action)
		const activity = getEmptyActivity(board, taskId, action)
		board.activities.unshift(activity)

		await save(board)
		return board
	} catch (err) {
		throw err
	}
}

function getEmptyActivity(board, entityId = '', action = {}) {
	const users = getBoardMembers(board)
	const user = users[utilService.getRandomIntInclusive(0, users.length - 1)]

	return {
		id: utilService.makeId(),
		createdAt: Date.now(),
		by: user,
		entityId,
		action,
	}
}

async function addTaskToFirstGroup(boardId, action = {}) {
	try {
		const board = await getById(boardId)
		const task = getEmptyTask()
		task.title = 'New Task'
		task.id = utilService.makeId()
		board.groups[0].tasks.push(task)

		const activity = getEmptyActivity(board, task.id, action)
		board.activities.unshift(activity)

		await save(board)
		return board
	} catch (err) {
		throw err
	}
}

async function updateGroup(boardId, group) {
	try {
		const board = await getById(boardId)
		board.groups = board.groups.map(g => (g.id === group.id ? group : g))
		await save(board)
		return board
	} catch (err) {
		throw err
	}
}

async function removeGroup(boardId, groupId, action = {}) {
	try {
		const board = await getById(boardId)
		board.groups = board.groups.filter(g => g.id !== groupId)

		const activity = getEmptyActivity(board, groupId, action)
		board.activities.unshift(activity)

		await save(board)
		return board
	} catch (err) {
		throw err
	}
}

function getDefaultFilter() {
	return {
		txt: '',
		memberId: '',
		advancedFilter: {
			groups: {},
			tasks: {},
			members: {},
			timeLines: {},
			durations: {},
			priorities: {},
			statuses: {},
		},
		sort: {},
		shownColumns: [],
	}
}

function groupHasDate(group) {
	return group.tasks.some(task => task.dueDate)
}

function getGroupDateSummary(group) {
	let dates = []
	const hasTimeline = group.tasks.some(task => task.dueDate)

	if (!hasTimeline) return

	group.tasks.forEach(task => {
		const { dueDate } = task

		if (!dueDate) return
		if (dates.includes(dueDate)) return
		dates.push(dueDate)
	})
	// console.log(dates)
	const earliestDate = Math.min(...dates)
	const latestDate = Math.max(...dates)
	return {
		earliestDate,
		latestDate,
	}
}

// const activities = [
// 	{
// 		id: '1238a',
// 		createdAt: '12328267658',
// 		by: {
// 			_id: '18D',
// 			fullname: 'muki',
// 			imgUrl: '../../assets...'
// 		},
// 		taskId: task.id,
// 		actionType: 'label'
// 		action: {
// 			description,
// 		},
// 	}
// ]

// component types
// timeSince | user | level | type | dynamic cmp
// group: group | type (no cmp to render) // (delete/ add)
// group color change: group | type | from clf1 -> clr2
// task: task | type | related group  // (add/ delete)
// label: task | type | from label x -> to label y
// name: task | type | from name1 -> name2
// timeline: task | type | from 01/09 -> 02/09
// date: from Jun 6 -> Jun 14
// person: task | person | added | user img
// owner: task | 'added owner' | (person)
