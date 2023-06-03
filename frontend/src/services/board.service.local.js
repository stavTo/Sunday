import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'
import { DEFAULT_USER } from '../assets/icons/icons.js'
import { async } from 'q'

const STORAGE_KEY = 'board'

export const boardService = {
	query,
	getById,
	save,
	remove,
	getEmptyBoard,
	addBoardMsg,
	saveTask,
	addTask,
	getEmptyTask,
	addEmptyGroup,
	getEmptyGroup,
	removeTask,
	addTaskToFirstGroup,
	getDefaultFilter,
	getEmptyLabel,
	updateLabels,
	getTaskById,
	getGroupByTask,
	getEmptyComment,
	saveComment
}

async function query(filter = {}) {
	var boards = await storageService.query(STORAGE_KEY)
	//TODO MOVE FILTER TO BACKEND
	if (filter.txt) {
		const regex = new RegExp(filter.txt, 'i')
		boards = boards.filter(board => regex.test(board.title))
	}
	return boards
}

async function getById(boardId, filter = {}) {
	let board
	try {
		board = await storageService.get(STORAGE_KEY, boardId)
	} catch (err) {
		console.log(err)
	}
	//TODO MOVE FILTER TO BACKEND
	if (filter.txt) {
		const regex = new RegExp(filter.txt, 'i')

		// filter groups with title, if group title doesn't match, filter its tasks.
		board.groups = board.groups.map(group =>
			regex.test(group.title) ? group : { ...group, tasks: group.tasks.filter(task => regex.test(task.title)) }
		)

		// after filtering tasks, remove groups where no task matches.
		board.groups = board.groups.filter(group => group.tasks.length)
	}
	return board
}

async function remove(boardId) {
	// throw new Error('Nope')
	await storageService.remove(STORAGE_KEY, boardId)
}

async function save(board) {
	var savedBoard
	if (board._id) {
		savedBoard = await storageService.put(STORAGE_KEY, board)
	} else {
		// Later, owner is set by the backend
		board.owner = userService.getLoggedInUser()
		savedBoard = await storageService.post(STORAGE_KEY, board)
	}
	return savedBoard
}

async function addBoardMsg(boardId, txt) {
	// Later, this is all done by the backend
	const board = await getById(boardId)
	if (!board.msgs) board.msgs = []

	const msg = {
		id: utilService.makeId(),
		by: userService.getLoggedInUser(),
		txt,
	}
	board.msgs.push(msg)
	await storageService.put(STORAGE_KEY, board)

	return msg
}

function getEmptyBoard() {
	return {
		_id: '',
		title: '',
		isStarred: false,
		archivedAt: null,
		createdBy: { _id: '', fullname: '', imgUrl: '' },
		style: {},
		members: [],
		groups: [],
		cmpsOrder: [],
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
	}
}

function getEmptyTask() {
	return {
		id: '',
		title: '',
		status: '',
		priority: '',
		comments: [],
		collaborators: [],
		dueDate: null,
		owner: {
			_id: '',
			username: '',
			fullname: '',
			imgUrl: 'https://asset.cloudinary.com/diyikz4gq/3a419ce071a927e482ec39a775a4677d',
		},
	}
}

function getEmptyGroup() {
	return {
		id: '',
		title: 'New Group',
		tasks: [],
		style: { backgroundColor: utilService.getRandomColor() },
	}
}

function getEmptyLabel() {
	return {
		id: utilService.makeId(),
		title: '',
		color: '#c4c4c4'
	}
}

async function addEmptyGroup(boardId, pushToTop, activity = '') {
	const newGroup = getEmptyGroup()
	newGroup.id = utilService.makeId()
	const board = await getById(boardId)
	pushToTop ? board.groups.push(newGroup) : board.groups.unshift(newGroup)
	await save(board)
	return board
}

async function updateLabels(board, labelsName, labels) {
	const boardToSave = { ...board }
	boardToSave[labelsName] = labels
	await save(boardToSave)
	return boardToSave
}

function getTaskById(board, groupId, taskId) {
	const group = board.groups.find(g => g.id === groupId)
	const task = group.tasks.find(t => t.id === taskId)
	return task
}

function getGroupByTask(board, taskId) {
	const group = board.groups.find(g => g.tasks.some(t => t.id === taskId))
	return group
}

async function saveTask(boardId, groupId, task, activity = '') {
	const board = await getById(boardId)
	// PUT /api/board/b123/task/t678

	board.groups = board.groups.map(group =>
		group.id !== groupId ? group : { ...group, tasks: group.tasks.map(t => (t.id === task.id ? task : t)) }
	)
	// board.board.activities.unshift(activity)
	await save(board)
	return board
}

async function addTask(boardId, groupId, task, activity = '') {
	const board = await getById(boardId)
	task.id = utilService.makeId()
	// PUT /api/board/b123/task/t678

	board.groups = board.groups.map(group =>
		group.id !== groupId ? group : { ...group, tasks: [...group.tasks, task] }
	)
	// board.board.activities.unshift(activity)
	await save(board)
	return board
}

async function addTaskToFirstGroup(boardId, activity = '') {
	const board = await getById(boardId)
	const task = getEmptyTask()
	task.title = 'New Task'
	task.id = utilService.makeId()
	// PUT /api/board/b123/task/t678
	board.groups[0].tasks.push(task)
	// board.board.activities.unshift(activity)
	await save(board)
	return board
}

async function removeTask(boardId, groupId, taskId, activity = '') {
	const board = await getById(boardId)
	// PUT /api/board/b123/task/t678

	board.groups = board.groups.map(group =>
		group.id !== groupId ? group : { ...group, tasks: group.tasks.filter(t => t.id !== taskId) }
	)
	// board.board.activities.unshift(activity)
	await save(board)
	return board
}

async function saveComment(board, groupId, taskId, commentToEdit) {
	const group = board.groups.find(g => g.id === groupId)
	const task = group.tasks.find(t => t.id === taskId)
	task.comments.unshift(commentToEdit)
	await save(board)
	return commentToEdit
}


function getEmptyComment() {
	return {
		txt: '',
		id: utilService.makeId()
	}
}

// async function updateLabelInTask(boardId, groupId, taskId, labelTaskName, label) {
// 	const board = await getById(boardId)
// 	// console.log(groupId)
// 	// console.log(board.groups[groupId])
// 	const group = board.groups.find(group => group.id === groupId)
// 	const task = group.tasks.find(task => task.id === taskId)
// 	console.log(task)
// 	task[labelTaskName] = label.title
// 	await save(board)
// 	return board
// }

function getDefaultFilter() {
	return {
		txt: '',
		byUserId: '',
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

function _getDummyBoard(boardNum) {
	return {
		title: `Fake Board`,
		description: '',
		isStarred: false,
		archivedAt: 1589983468418,
		createdBy: {
			_id: 'u101',
			fullname: 'Abi Abambi',
			imgUrl: 'http://some-img',
		},
		style: {},
		members: [
			{
				_id: 'u101',
				fullname: 'Tal Tarablus',
				imgUrl: 'https://www.google.com',
			},
		],
		groups: [
			{
				id: 'g101',
				title: 'Group 1',
				archivedAt: 1589983468418,
				tasks: [
					{
						id: 'c101',
						title: 'Replace logo',
					},
					{
						id: 'c102',
						title: 'Add Samples',
					},
				],
				style: {},
			},
			{
				id: 'g102',
				title: 'Group 2',
				tasks: [
					{
						id: 'c103',
						title: 'Product Research',
						status: 'not-started',
						owner: { _id: 'U301', fullname: 'Roni Yerushalmi', imgUrl: DEFAULT_USER },
						collaborators: [],
						dueDate: '2023-05-15',
						description: 'Conduct market research for popular toy categories and trends',
						priority: 'high',
						category: 'research',
						comments: []
					},
					{
						id: 'c104',
						title: 'Define Target Audience',
						status: 'not-started',
						owner: { _id: 'U301', fullname: 'Roni Yerushalmi', imgUrl: DEFAULT_USER },
						collaborators: [],
						dueDate: '2023-05-17',
						description: 'Identify the target audience for the online toy store',
						priority: 'medium',
						category: 'strategy',
						comments: []
					},
					{
						id: 'c105',
						title: 'Create Product Catalog',
						status: 'in-progress',
						owner: { _id: 'U301', fullname: 'Roni Yerushalmi', imgUrl: DEFAULT_USER },
						collaborators: [],
						dueDate: '2023-05-20',
						description: 'Compile a comprehensive catalog of toys available for sale',
						priority: 'high',
						category: 'catalog',
						comments: []
					},
					{
						id: 'c106',
						title: 'Website Development',
						status: 'not-started',
						owner: { _id: 'U301', fullname: 'Roni Yerushalmi', imgUrl: DEFAULT_USER },
						collaborators: [],
						dueDate: '2023-05-22',
						description: 'Develop an engaging and user-friendly website for the online store',
						priority: 'high',
						category: 'development',
						comments: []
					},
					{
						id: 'c107',
						title: 'Inventory Management System',
						status: 'not-started',
						owner: { _id: 'U301', fullname: 'Roni Yerushalmi', imgUrl: DEFAULT_USER },
						collaborators: [],
						dueDate: '2023-05-25',
						description: 'Implement a system to manage toy inventory and stock levels',
						priority: 'medium',
						category: 'operations',
						comments: []
					},
					{
						id: 'c108',
						title: 'Marketing Strategy',
						status: '',
						owner: { _id: 'U301', fullname: 'Roni Yerushalmi', imgUrl: DEFAULT_USER },
						collaborators: [],
						dueDate: '2023-05-30',
						description: 'Develop a marketing strategy to promote the online toy store',
						priority: 'high',
						category: 'marketing',
						comments: []
					},
				],
				style: {},
			},
		],
		activities: [
			{
				id: 'a101',
				txt: 'Changed Color',
				createdAt: 154514,
				byMember: {
					_id: 'u101',
					fullname: 'Abi Abambi',
					imgUrl: 'http://some-img',
				},
				task: {
					id: 'c101',
					title: 'Replace Logo',
				},
			},
		],
		cmpsOrder: [
			{ id: utilService.makeId(), cmpName: 'statusPicker' },
			{ id: utilService.makeId(), cmpName: 'priorityPicker' },
			{ id: utilService.makeId(), cmpName: 'ownerPicker' },
			{ id: utilService.makeId(), cmpName: 'datePicker' },
			{ id: utilService.makeId(), cmpName: 'collaboratorPicker' },
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
	}
}

// Product Research	Not Started	John Smith	2023-05-15	Conduct market research for popular toy categories and trends	High	Research
// Define Target Audience	Not Started	Mary Johnson	2023-05-17	Identify the target audience for the online toy store	Medium	Strategy
// Create Product Catalog	In Progress	Sarah Davis	2023-05-20	Compile a comprehensive catalog of toys available for sale	High	Catalog
// Website Development	Not Started	David Wilson	2023-05-22	Develop an engaging and user-friendly website for the online store	High	Development
// Inventory Management System	Not Started	Mark Thompson	2023-05-25	Implement a system to manage toy inventory and stock levels	Medium	Operations
// Marketing Strategy	Not Started	Emily Brown	2023-05-30	Develop a marketing strategy to promote the online toy store	High	Marketing

// storageService.post(STORAGE_KEY, _getDummyBoard(1))
