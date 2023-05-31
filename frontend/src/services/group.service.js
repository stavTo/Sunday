import { utilService } from './util.service.js'


const BOARD_KEY = 'boardDB'

export const groupService = {
    getGroupById,
    removeGroup,
    saveGroup,
    getEmptyGroup
}


function getGroupById(groupId) {
	return storageService.get(BOARD_KEY, noteId)
}

async function removeGroup(boardId, groupId) {
    return httpService.delete(BOARD_KEY + groupId)
}

async function saveGroup(boardId, group) {
    if (group.id) {
        return httpService.put(BOARD_KEY + group.id, group)
    } else {
        return httpService.post(BOARD_KEY, group)
    }
}


function getEmptyGroup() {
    return {
        id: "",
        title: "Group Title",
        archivedAt: 1589983468418,
        tasks: [],
        style: {}
    }
}