import { dbService } from '../../services/db.service.mjs'
import { logger } from '../../services/logger.service.mjs'
import { config } from "dotenv"
import { utilService } from '../../services/util.service.mjs'
config()
import { Configuration, OpenAIApi } from 'openai'
import mongodb from 'mongodb'
const { ObjectId } = mongodb

async function query(filterBy = { txt: '' }) {
	try {
		const criteria = {}
		const collection = await dbService.getCollection('board')
		const boards = await collection.find(criteria).toArray()
		return boards
	} catch (err) {
		logger.error('cannot find boards', err)
		throw err
	}
}

async function getLastCollection() {
	try {
		const collection = await dbService.getCollection('board')
		const lastBoard = await collection.findOne({}, { sort: { createdAt: -1 } })
		console.log("lastBoard", lastBoard)
		return lastBoard
	} catch (err) {
		logger.error('cannot find last board', err)
		throw err
	}
}

async function getById(boardId, filter) {
	try {
		const collection = await dbService.getCollection('board')
		const board = await collection.findOne({ _id: ObjectId(boardId) })
		if (filter.txt) {
			const regex = new RegExp(filter.txt, 'i')

			// filter groups with title, if group title doesn't match, filter its tasks.
			board.groups = board.groups.map(group =>
				regex.test(group.title)
					? group
					: { ...group, tasks: group.tasks.filter(task => regex.test(task.title)) }
			)
		}
		if (filter.memberId) {
			board.groups = board.groups.map(group => ({
				...group,
				tasks: group.tasks.filter(
					task =>
						task.owner._id === filter.memberId ||
						task.collaborators.some(collaborator => collaborator._id === filter.memberId)
				),
			}))
		}
		if (filter && JSON.stringify(filter) !== '{}') board.groups = board.groups.filter(group => group.tasks.length)
		// after filtering tasks, remove groups where no task matches.

		return board
	} catch (err) {
		logger.error(`while finding board ${boardId}`, err)
		throw err
	}
}

async function remove(boardId) {
	try {
		const collection = await dbService.getCollection('board')
		await collection.deleteOne({ _id: ObjectId(boardId) })
		return boardId
	} catch (err) {
		logger.error(`cannot remove board ${boardId}`, err)
		throw err
	}
}

async function add(board) {
	try {
		const collection = await dbService.getCollection('board')
		await collection.insertOne(board)
		return board
	} catch (err) {
		logger.error('cannot insert board', err)
		throw err
	}
}

async function update(board) {
	try {
		const id = board._id
		delete board._id
		const collection = await dbService.getCollection('board')
		await collection.updateOne({ _id: ObjectId(id) }, { $set: board })
		return board
	} catch (err) {
		logger.error(`cannot update board ${board._id}`, err)
		throw err
	}
}

async function sendAPIRequest(aiQuery) {
	const openai = new OpenAIApi(
		new Configuration({
			apiKey: process.env.API_KEY,
		})
	)
	
	try {
		const res = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			max_tokens: 1000,
			temperature: 0.5,
			messages: _getAiInstructions(aiQuery),
		})

		const response = res.data.choices[0].message.content
		const aiBoard = JSON.parse(response)

		return createAiBoard(aiBoard)
	} catch (err) {
		throw err
	}
}

function _getEmptyBoard() {
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

function _getEmptyTask(title = '', status = 'sl104') {
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

async function createAiBoard(aiBoard) {
	const board = _getEmptyBoard()
	const task = _getEmptyTask()

	board.title = aiBoard.title

	const aiGroups = aiBoard.groups.map(aiGroup => {
		const group = {
			...aiGroup,
			id: utilService.makeId(),
			style: { color: utilService.getRandomColor() },
		}

		const aiTasks = group.tasks.map(aiTask => ({
			...task,
			...aiTask,
			id: utilService.makeId(),
		}))

		group.tasks = aiTasks
		return group
	})

	board.groups.push(...aiGroups)
	const addedBoard = await add(board)
	return addedBoard
}

function _getAiInstructions(aiQuery) {
	return [
		{
			role: 'system',
			content: `
	You are an AI assistant helping with the creation of project management templates for a project management app. Please provide in your response ONLY a valid JSON string that can be parsed back to an object that includes the board name, groups, and tasks based on the given user input. the tasks and the division of groups must be realted to the subject of the theme that the user has entered. You MUST not reply in any other way that is not according to the following format: "{"title":\"Board Name\","groups":[{"title":\"Group Name\","tasks":[{"title":\"Task description1\"},{"title":\"Task description2\"},{"title":\"Task description3\"}]}]}". You MUST send it in a valid JSON format, DO NOT forget to wrap ALL keys and their values with apostrophes (i.e ").`,
		},
		{ role: 'user', content: `My projects theme is: ${aiQuery}` },
	]
}

export const boardService = {
	remove,
	query,
	getById,
	add,
	update,
	sendAPIRequest,
}
