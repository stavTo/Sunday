import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

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
}

async function query(filterBy = { txt: '', price: 0 }) {
	var boards = await storageService.query(STORAGE_KEY)
	if (filterBy.txt) {
		const regex = new RegExp(filterBy.txt, 'i')
		boards = boards.filter(board => regex.test(board.vendor) || regex.test(board.description))
	}
	if (filterBy.price) {
		boards = boards.filter(board => board.price <= filterBy.price)
	}
	return boards
}

function getById(boardId) {
	return storageService.get(STORAGE_KEY, boardId)
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
		description: '',
		isStarred: false,
		archivedAt: null,
		createdBy: { _id: '', fullname: '', imgUrl: '' },
		style: {},
		members: [],
		groups: [],
		cmpsOrder: [],
	}
}

function getEmptyTask() {
	return {
		id: '',
		title: '',
		status: '',
		priority: '',
		comments: [],
		memberIds: [],
		dueDate: null,
		byMember: {
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

async function addEmptyGroup(boardId, pushToTop, activity = '') {
	const newGroup = getEmptyGroup()
	newGroup.id = utilService.makeId()
	const board = await getById(boardId)
	pushToTop ? board.groups.push(newGroup) : board.groups.unshift(newGroup)
	await save(board)
	return board
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

function _getDummyBoard(boardNum) {
	return {
		title: `board${boardNum}`,
		description: '',
		isStarred: false,
		archivedAt: 1589983468418,
		createdBy: {
			_id: 'u101',
			fullname: 'Abi Abambi',
			imgUrl: 'http://some-img',
		},
		style: {},
		labels: [
			{
				id: 'l101',
				title: 'Done',
				color: '#00C875',
			},
			{
				id: 'l102',
				title: 'In-progress',
				color: '#FDAB3D',
			},
		],
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
						id: 'c101',
						title: 'Product Research',
						status: 'not-started',
						assignee: 'John Smith',
						dueDate: '2023-05-15',
						description: 'Conduct market research for popular toy categories and trends',
						priority: 'high',
						category: 'research',
					},
					{
						id: 'c102',
						title: 'Define Target Audience',
						status: 'not-started',
						assignee: 'Mary Johnson',
						dueDate: '2023-05-17',
						description: 'Identify the target audience for the online toy store',
						priority: 'medium',
						category: 'strategy',
					},
					{
						id: 'c103',
						title: 'Create Product Catalog',
						status: 'in-progress',
						assignee: 'Sarah Davis',
						dueDate: '2023-05-20',
						description: 'Compile a comprehensive catalog of toys available for sale',
						priority: 'high',
						category: 'catalog',
					},
					{
						id: 'c104',
						title: 'Website Development',
						status: 'not-started',
						assignee: 'David Wilson',
						dueDate: '2023-05-22',
						description: 'Develop an engaging and user-friendly website for the online store',
						priority: 'high',
						category: 'development',
					},
					{
						id: 'c105',
						title: 'Inventory Management System',
						status: 'not-started',
						assignee: 'Mark Thompson',
						dueDate: '2023-05-25',
						description: 'Implement a system to manage toy inventory and stock levels',
						priority: 'medium',
						category: 'operations',
					},
					{
						id: 'c106',
						title: 'Marketing Strategy',
						status: 'not-started',
						assignee: 'Emily Brown',
						dueDate: '2023-05-30',
						description: 'Develop a marketing strategy to promote the online toy store',
						priority: 'high',
						category: 'marketing',
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
			{ id: utilService.makeId(), cmpName: 'status-picker' },
			{ id: utilService.makeId(), cmpName: 'owner-picker' },
			{ id: utilService.makeId(), cmpName: 'date-picker' },
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
