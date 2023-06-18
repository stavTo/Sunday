import { httpService } from './http.service.js'
import { SOCKET_EMIT_SEND_BOARD, socketService } from './socket.service.js'
import { utilService } from './util.service.js'

import { DEFAULT_USER } from '../assets/icons/icons.js'
import { userService } from './user.service.js'

const BASE_URL = 'board/'

async function query(filterBy = { txt: '', price: 0 }) {
	return httpService.get(BASE_URL, filterBy)
}

async function addBoard(board) {
	return httpService.post(BASE_URL, board)
}

function getById(boardId, filter = {}) {
	return httpService.get(BASE_URL + boardId, filter)
}

async function remove(boardId) {
	return httpService.delete(BASE_URL + boardId)
}

async function sendAPIRequest(query) {
	const aiQuery = {
		query
	}
	console.log("aiQuery", aiQuery)
	return httpService.post(BASE_URL + 'aiBoard', aiQuery)
}

async function save(board) {
	try {
		let savedBoard
		if (board._id) {
			savedBoard = await httpService.put(BASE_URL + board._id, board)
		} else {
			savedBoard = await httpService.post(BASE_URL, board)
		}
		socketService.emit(SOCKET_EMIT_SEND_BOARD)
		return savedBoard
	} catch (err) {
		throw err
	}
}

async function getLastBoard() {
	try {
		return await httpService.get(BASE_URL + 'lastBoard')
	} catch (err) {
		throw err
	}
}

function getEmptyBoard() {
	return {
		title: '',
		isStarred: false,
		description: '',
		archivedAt: null,
		createdBy: { _id: '', fullname: '', imgUrl: '' },
		members: [],
		groups: [],
		cmpsOrder: [
			{ id: utilService.makeId(), cmpName: 'ownerPicker', defaultWidth: '85px', minWidth: '85px', isShown: true },
			{
				id: utilService.makeId(),
				cmpName: 'statusPicker',
				defaultWidth: '150px',
				minWidth: '50px',
				isShown: true,
			},
			{
				id: utilService.makeId(),
				cmpName: 'priorityPicker',
				defaultWidth: '150px',
				minWidth: '50px',
				isShown: true,
			},
			{
				id: utilService.makeId(),
				cmpName: 'timelinePicker',
				defaultWidth: '150px',
				minWidth: '70px',
				isShown: true,
			},
			{
				id: utilService.makeId(),
				cmpName: 'collaboratorPicker',
				defaultWidth: '150px',
				minWidth: '100px',
				isShown: true,
			},
			{ id: utilService.makeId(), cmpName: 'datePicker', defaultWidth: '100px', minWidth: '50px', isShown: true },
		],
		statusLabels: [
			{ id: 'sl100', title: 'Done', color: '#00C875' },
			{ id: 'sl101', title: 'Working on it', color: '#FDAB3D' },
			{ id: 'sl102', title: 'Stuck', color: '#E2445C' },
			{ id: 'sl103', title: 'Almost done', color: '#0086C0' },
			{ id: 'sl104', title: '', color: '#C4C4C4' },
		],
		priorityLabels: [
			{ id: 'pl100', title: 'Critical', color: '#333333' },
			{ id: 'pl101', title: 'High', color: '#401694' },
			{ id: 'pl102', title: 'Medium', color: '#5559DF' },
			{ id: 'pl103', title: 'Low', color: '#579BFC' },
			{ id: 'pl104', title: '', color: '#C4C4C4' },
		],
		activities: [],
	}
}

function getNewBoard() {
	return {
		title: 'New Board',
		isStarred: false,
		description: '',
		archivedAt: null,
		createdBy: { _id: '', fullname: '', imgUrl: '' },
		members: [
			{
				_id: 'u101',
				fullname: 'Ido Kadosh',
				imgUrl: 'https://res.cloudinary.com/diyikz4gq/image/upload/v1686151189/ido-img_ryaaxn.jpg',
			},
			{
				_id: 'u102',
				fullname: 'Roni Yerushalmi',
				imgUrl: 'https://res.cloudinary.com/diyikz4gq/image/upload/v1686151190/roni-img_rvqeda.jpg',
			},
			{
				_id: 'u103',
				fullname: 'Stav Tohami',
				imgUrl: 'https://res.cloudinary.com/diyikz4gq/image/upload/v1686151190/stav-img_bfayq4.jpg',
			},
			{ _id: 'u104', fullname: 'Elon Barazani', imgUrl: DEFAULT_USER },
			{ _id: 'u105', fullname: 'Risan Benichou', imgUrl: DEFAULT_USER },
		],
		groups: [
			{
				id: 'g101',
				title: 'Group Title',
				archivedAt: null,
				tasks: [
					{
						id: 'c101',
						title: 'Item 1',
						status: 'sl101',
						owner: {},
						collaborators: [],
						timeline: {
							startDate: null,
							endDate: null,
						},
						dueDate: null,
						comments: [],
						priority: 'pl104',
					},
					{
						id: 'c102',
						title: 'Item 2',
						status: 'sl103',
						owner: {},
						collaborators: [],
						timeline: {
							startDate: null,
							endDate: null,
						},
						dueDate: null,
						comments: [],
						priority: 'pl104',
					},
					{
						id: 'c103',
						title: 'Item 3',
						status: 'sl104',
						owner: {},
						collaborators: [],
						timeline: {
							startDate: null,
							endDate: null,
						},
						dueDate: null,
						comments: [],
						priority: 'pl104',
					},
				],
				style: {
					color: '#579BFC',
				},
			},
			{
				id: 'g102',
				title: 'Group Title',
				archivedAt: null,
				tasks: [
					{
						id: 'c104',
						title: 'Item 4',
						status: 'sl104',
						owner: {},
						collaborators: [],
						timeline: {
							startDate: null,
							endDate: null,
						},
						dueDate: null,
						comments: [],
						priority: 'pl104',
					},
					{
						id: 'c105',
						title: 'Item 5',
						status: 'sl104',
						owner: {},
						collaborators: [],
						timeline: {
							startDate: null,
							endDate: null,
						},
						dueDate: null,
						comments: [],
						priority: 'pl104',
					},
				],
				style: {
					color: '#A25DDC',
				},
			},
		],
		cmpsOrder: [
			{ id: utilService.makeId(), cmpName: 'ownerPicker', defaultWidth: '85px', minWidth: '85px', isShown: true },
			{
				id: utilService.makeId(),
				cmpName: 'statusPicker',
				defaultWidth: '150px',
				minWidth: '50px',
				isShown: true,
			},
			{
				id: utilService.makeId(),
				cmpName: 'priorityPicker',
				defaultWidth: '150px',
				minWidth: '50px',
				isShown: true,
			},
			{
				id: utilService.makeId(),
				cmpName: 'timelinePicker',
				defaultWidth: '150px',
				minWidth: '70px',
				isShown: true,
			},
			{
				id: utilService.makeId(),
				cmpName: 'collaboratorPicker',
				defaultWidth: '150px',
				minWidth: '100px',
				isShown: true,
			},
			{ id: utilService.makeId(), cmpName: 'datePicker', defaultWidth: '100px', minWidth: '50px', isShown: true },
		],
		statusLabels: [
			{ id: 'sl100', title: 'Done', color: '#00C875' },
			{ id: 'sl101', title: 'Working on it', color: '#FDAB3D' },
			{ id: 'sl102', title: 'Stuck', color: '#E2445C' },
			{ id: 'sl103', title: 'Almost done', color: '#0086C0' },
			{ id: 'sl104', title: '', color: '#C4C4C4' },
		],
		priorityLabels: [
			{ id: 'pl100', title: 'Critical', color: '#333333' },
			{ id: 'pl101', title: 'High', color: '#401694' },
			{ id: 'pl102', title: 'Medium', color: '#5559DF' },
			{ id: 'pl103', title: 'Low', color: '#579BFC' },
			{ id: 'pl104', title: '', color: '#C4C4C4' },
		],
		activities: [],
	}
}

function getEmptyTask(title = '', status = 'sl104') {
	return {
		id: '',
		title,
		status,
		priority: 'pl104',
		comments: [],
		collaborators: [],
		dueDate: null,
		timeline: {
			startDate: null,
			endDate: null,
		},
		owner: {
			_id: '',
			username: '',
			fullname: '',
			imgUrl: '',
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

async function addGroup(boardId, pushToTop, title = '') {
	const hasTitle = title ? getEmptyGroup(title) : getEmptyGroup()
	const newGroup = hasTitle
	newGroup.id = utilService.makeId()
	try {
		const action = {
			description: 'New Group',
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

async function duplicateGroup(boardId, group, action = {}) {
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

		const activity = getEmptyActivity(board, newGroup.id, action)
		board.activities.unshift(activity)

		await save(board)
		return board
	} catch (err) {
		throw err
	}
}

async function duplicateTask(boardId, group, task, boolean, action = {}) {
	const newTask = boolean ? { ...task } : getEmptyTask('New task')
	newTask.id = utilService.makeId()
	try {
		const board = await getById(boardId)
		const currGroup = board.groups.find(g => g.id === group.id)
		const idx = currGroup.tasks.findIndex(t => t.id === task.id)
		currGroup.tasks.splice(idx + 1, 0, newTask)

		const activity = getEmptyActivity(board, newTask.id, action)
		board.activities.unshift(activity)
		await save(board)
		return board
	} catch (err) {
		throw err
	}
}

async function updateLabels(board, labelsName, labels, action = {}) {
	const boardToSave = structuredClone(board)
	boardToSave[labelsName] = labels
	try {
		const activity = getEmptyActivity(board, '', action)
		board.activities.unshift(activity)

		await save(boardToSave)
		return boardToSave
	} catch (err) {
		throw err
	}
}

function getTaskById(board, taskId) {
	const newBoard = structuredClone(board)
	const group = newBoard.groups.find(g => g.tasks.find(t => t.id === taskId))
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
		const board = await getById(boardId)
		board.groups = board.groups.map(group => ({ ...group, tasks: group.tasks.filter(t => t.id !== taskId) }))

		const activity = getEmptyActivity(board, taskId, action)
		board.activities.unshift(activity)

		await save(board)
		return board
	} catch (err) {
		throw err
	}
}

async function removeBatchTasks(boardId, taskIds, actions = []) {
	try {
		const board = await getById(boardId)
		board.groups = board.groups.map(group => ({
			...group,
			tasks: group.tasks.filter(t => {
				const keepTask = !taskIds.includes(t.id)
				if (!keepTask) {
					const activity = getEmptyActivity(board, t.id, actions.splice(0, 1)[0]) // splice first item, and send it to getEmptyActivity
					board.activities.unshift(activity)
				}
				return keepTask
			}),
		}))

		await save(board)
		return board
	} catch (err) {
		throw err
	}
}

function getEmptyActivity(board, entityId = '', action = {}) {
	let user = userService.getLoggedInUser()
	if (!user) {
		const users = getBoardMembers(board)
		user = users[utilService.getRandomIntInclusive(0, users.length - 1)]
	}

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

async function updateGroup(boardId, group, action) {
	try {
		const board = await getById(boardId)
		board.groups = board.groups.map(g => (g.id === group.id ? group : g))

		const activity = getEmptyActivity(board, group.id, action)
		board.activities.unshift(activity)

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

function getActivityFilter(taskId = '') {
	return {
		txt: '',
		member: '',
		taskId,
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
	const earliestDate = Math.min(...dates)
	const latestDate = Math.max(...dates)
	return {
		earliestDate,
		latestDate,
	}
}

function loadActivities(board, filter = {}) {
	let filteredActivities = board.activities
	if (filter.txt) {
		const regex = new RegExp(filter.txt, 'i')
		filteredActivities = filteredActivities.filter(activity => regex.test(activity.action.description))
	}
	if (filter.taskId) {
		filteredActivities = filteredActivities.filter(activity => activity.entityId === filter.taskId)
	}
	return filteredActivities
}

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
	getNewBoard,
	addBoard,
	loadActivities,
	getActivityFilter,
	removeBatchTasks,
	getLastBoard,
	sendAPIRequest,
}
