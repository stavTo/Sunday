import { dbService } from '../../services/db.service.mjs'
import { logger } from '../../services/logger.service.mjs'
import { utilService } from '../../services/util.service.mjs'
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
			board.groups = board.groups.filter(group => group.tasks.length)
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

export const boardService = {
	remove,
	query,
	getById,
	add,
	update,
}
