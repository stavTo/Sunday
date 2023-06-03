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
	saveComment,
	updateGroup,
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
		style: { color: utilService.getRandomColor() },
	}
}

function getEmptyLabel() {
	return {
		id: utilService.makeId(),
		title: '',
		color: '#c4c4c4',
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

async function updateGroup(boardId, group) {
	const board = await getById(boardId)
	board.groups = board.groups.map(g => (g.id === group.id ? group : g))
	await save(board)
	return board
}

async function saveComment(board, groupId, taskId, commentToEdit) {
	const group = board.groups.find(g => g.id === groupId)
	const task = group.tasks.find(t => t.id === taskId)
	commentToEdit.id = utilService.makeId()
	task.comments.unshift(commentToEdit)
	await save(board)
	return commentToEdit
}

function getEmptyComment() {
	return {
		txt: '',
		id: '',
	}
}

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
		title: 'Moovit',
		description: 'Building the best transportation platform out there',
		isStarred: false,
		archivedAt: null,
		createdBy: {
			_id: 'u101',
			fullname: 'Ido Kadosh',
			imgUrl: DEFAULT_USER,
		},
		members: [
			{ _id: 'u101', fullname: 'Ido Kadosh', imgUrl: DEFAULT_USER },
			{ _id: 'u102', fullname: 'Roni Yerushalmi', imgUrl: DEFAULT_USER },
			{ _id: 'u103', fullname: 'Stav Tohami', imgUrl: DEFAULT_USER },
			{ _id: 'u104', fullname: 'Eyal Golan', imgUrl: DEFAULT_USER },
			{ _id: 'u105', fullname: 'Steve Jobs', imgUrl: DEFAULT_USER },
		],
		groups: [
			{
				id: 'g101',
				title: 'Marketing',
				archivedAt: null,
				tasks: [
					{
						id: 'c101',
						title: 'Advertising on billboards',
						status: 'Working on it',
						owner: { _id: 'u103', fullname: 'Stav Tohami', imgUrl: DEFAULT_USER },
						collaborators: [{ _id: 'u103', fullname: 'Stav Tohami', imgUrl: DEFAULT_USER }],
						timeline: { startDate: 1686258000000, endDate: 1686862800000 },
						dueDate: 1686258000000,
						comments: [{ _id: '', content: '' }],
						priority: 'Medium',
					},
					{
						id: 'c102',
						title: 'Advertising on social media',
						status: 'Done',
						owner: { _id: 'u102', fullname: 'Roni Yerushalmi', imgUrl: DEFAULT_USER },
						collaborators: [],
						timeline: { startDate: 1688331600000, endDate: 1688850000000 },
						dueDate: null,
						comments: [],
						priority: 'Critical',
					},
					{
						id: 'c103',
						title: 'Collaboration with social media influencers',
						status: 'Stuck',
						owner: { _id: 'u101', fullname: 'Ido Kadosh', imgUrl: DEFAULT_USER },
						collaborators: [],
						timeline: { startDate: 1688936400000, endDate: 1690146000000 },
						dueDate: null,
						comments: [],
						priority: 'High',
					},
				],
				style: { color: '#579BFC' },
			},
			{
				id: 'g102',
				title: 'App development',
				archivedAt: null,
				tasks: [
					{
						id: 'c104',
						title: 'Frontend',
						status: 'Stuck',
						owner: { _id: 'u101', fullname: 'Ido Kadosh', imgUrl: DEFAULT_USER },
						collaborators: [],
						timeline: { startDate: 1688331600000, endDate: 1688850000000 },
						dueDate: 1686258000000,
						comments: [],
						priority: 'High',
					},
					{
						id: 'c105',
						title: 'Design a logo',
						status: 'Working on it',
						owner: {},
						collaborators: [
							{ _id: 'u103', fullname: 'Stav Tohami', imgUrl: DEFAULT_USER },
							{ _id: 'u102', fullname: 'Roni Yerushalmi', imgUrl: DEFAULT_USER },
						],
						timeline: { startDate: 1687035600000, endDate: 1687986000000 },
						dueDate: 1686255000000,
						comments: [],
						priority: 'Medium',
					},
					{
						id: 'c106',
						title: 'Design color palette',
						status: 'Almost done',
						owner: { _id: 'u101', fullname: 'Ido Kadosh', imgUrl: DEFAULT_USER },
						collaborators: [],
						timeline: { startDate: 1689195600000, endDate: 1688158800000 },
						dueDate: 1686258000000,
						comments: [],
						priority: 'High',
					},
					{
						id: 'c107',
						title: 'Purchase server',
						status: 'Stuck',
						owner: { _id: 'u102', fullname: 'Roni Yerushalmi', imgUrl: DEFAULT_USER },
						collaborators: [],
						timeline: { startDate: 1687467600000, endDate: 1687554000000 },
						dueDate: 1686258000000,
						comments: [],
						priority: 'Medium',
					},
					{
						id: 'c108',
						title: 'Node.js',
						status: 'Almost done',
						owner: { _id: 'u103', fullname: 'Stav Tohami', imgUrl: DEFAULT_USER },
						collaborators: [],
						timeline: { startDate: 1685566800000, endDate: 1685912400000 },
						dueDate: null,
						comments: [],
						priority: 'High',
					},
				],
				style: { color: '#A25DDC' },
			},
			{
				id: 'g103',
				title: 'Data Collection',
				archivedAt: null,
				tasks: [
					{
						id: 'c109',
						title: 'Estimate amount of consumers',
						status: 'Working on it',
						owner: { _id: 'u103', fullname: 'Stav Tohami', imgUrl: DEFAULT_USER },
						collaborators: [{ _id: 'u103', fullname: 'Stav Tohami', imgUrl: DEFAULT_USER }],
						timeline: { startDate: 1686430800000, endDate: 1686690000000 },
						dueDate: 1686258000000,
						comments: [],
						priority: '',
					},
					{
						id: 'c110',
						title: 'Schedule meetup with Eged',
						status: 'Working on it',
						owner: { _id: 'u103', fullname: 'Stav Tohami', imgUrl: DEFAULT_USER },
						collaborators: [{ _id: 'u103', fullname: 'Stav Tohami', imgUrl: DEFAULT_USER }],
						timeline: { startDate: 1686430800000, endDate: 1686690000000 },
						dueDate: 1686258000000,
						comments: [],
						priority: '',
					},
					{
						id: 'c111',
						title: 'Schedule meetup with Carmelit Haifa',
						status: 'Done',
						owner: { _id: 'u103', fullname: 'Stav Tohami', imgUrl: DEFAULT_USER },
						collaborators: [{ _id: 'u103', fullname: 'Stav Tohami', imgUrl: DEFAULT_USER }],
						timeline: { startDate: 1686430800000, endDate: 1686690000000 },
						dueDate: null,
						comments: [],
						priority: '',
					},
				],
				style: { color: '#00C875' },
			},
			{
				id: 'g104',
				title: 'Other tasks',
				archivedAt: null,
				tasks: [
					{
						id: 'c112',
						title: 'Work arrangement with taxi drivers',
						status: 'Working on it',
						owner: { _id: 'u103', fullname: 'Stav Tohami', imgUrl: DEFAULT_USER },
						collaborators: [{ _id: 'u103', fullname: 'Stav Tohami', imgUrl: DEFAULT_USER }],
						timeline: { startDate: 1686430800000, endDate: 1686690000000 },
						dueDate: 1686258000000,
						comments: [],
						priority: 'Low',
					},
					{
						id: 'c113',
						title: 'Carpool',
						status: 'Stuck',
						owner: { _id: 'u103', fullname: 'Stav Tohami', imgUrl: DEFAULT_USER },
						collaborators: [
							{ _id: 'u101', fullname: 'Ido Kadosh', imgUrl: DEFAULT_USER },
							{ _id: 'u102', fullname: 'Roni Yerushalmi', imgUrl: DEFAULT_USER },
							{ _id: 'u103', fullname: 'Stav Tohami', imgUrl: DEFAULT_USER },
						],
						timeline: { startDate: 1683925200000, endDate: 1689886800000 },
						dueDate: 1686258000000,
						comments: [],
						priority: 'Low',
					},
				],
				style: { color: '#E2565C' },
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
			{ id: utilService.makeId(), cmpName: 'ownerPicker' },
			{ id: utilService.makeId(), cmpName: 'statusPicker' },
			{ id: utilService.makeId(), cmpName: 'priorityPicker' },
			{ id: utilService.makeId(), cmpName: 'ownerPicker' },
			{ id: utilService.makeId(), cmpName: 'timelinePicker' },
			{ id: utilService.makeId(), cmpName: 'collaboratorPicker' },
			{ id: utilService.makeId(), cmpName: 'datePicker' },
		],
		statusLabels: [
			{ id: 'sl100', title: 'Done', color: '#00C875' },
			{ id: 'sl101', title: 'Working on it', color: '#fdab3d' },
			{ id: 'sl102', title: 'Stuck', color: '#e2445c' },
			{ id: 'sl103', title: 'Almost done', color: '#0086C0' },
			{ id: 'sl104', title: '', color: '#c4c4c4' },
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
