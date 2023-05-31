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
		isStarred: false,
		archivedAt: null,
		createdBy: { _id: '', fullname: '', imgUrl: '' },
		style: {},
		members: [],
		groups: [],
		cmpsOrder: [],
	}
}

function _getDummyBoard(boardNum) {
	return {
		title: `board${boardNum}`,
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
						title: 'Do that',
						archivedAt: 1589983468418,
					},
					{
						id: 'c104',
						title: 'Help me',
						status: 'in-progress', // monday
						priority: 'high',
						description: 'description',
						comments: [
							{
								id: 'ZdPnm',
								txt: 'also @yaronb please CR this',
								createdAt: 1590999817436,
								byMember: {
									_id: 'u101',
									fullname: 'Tal Tarablus',
									imgUrl: 'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
								},
							},
						],
						checklists: [
							{
								id: 'YEhmF',
								title: 'Checklist',
								todos: [
									{
										id: '212jX',
										title: 'To Do 1',
										isDone: false,
									},
								],
							},
						],
						memberIds: ['u101'],
						labelIds: ['l101', 'l102'],
						dueDate: 16156215211,
						byMember: {
							_id: 'u101',
							username: 'Tal',
							fullname: 'Tal Tarablus',
							imgUrl: 'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
						},
						style: {
							bgColor: '#26de81',
						},
					},
				],
				style: {},
			},
		],
		cmpsOrder: ['status-picker', 'member-picker', 'date-picker'],
	}
}

// storageService.post(STORAGE_KEY, _getDummyBoard(1))
