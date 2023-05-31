import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'
import { cloneElement } from 'react'

const STORAGE_KEY = 'task'

export const taskService = {
    query,
    getById,
    save,
    remove,
    getEmptyTask,
    addTaskMsg
}
window.cs = taskService


async function query(filterBy = { txt: '' }) {
    var tasks = await storageService.query(STORAGE_KEY)
    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        tasks = tasks.filter(task => regex.test(task.txt) || regex.test(task.description))
    }
    if (filterBy.price) {
        tasks = tasks.filter(task => task.price <= filterBy.price)
    }
    return tasks
}

async function getById(taskId) {
    try {
        await storageService.get(STORAGE_KEY, taskId)
    } catch (err) {
        console.error("err", err)
    }
}

async function remove(taskId) {
    try {
        await storageService.remove(STORAGE_KEY, taskId)
    } catch (err) {
        console.error("err", err)
    }
}

async function save(task) {
    var savedTask
    if (task._id) {
        savedTask = await storageService.put(STORAGE_KEY, task)
    } else {
        task.owner = userService.getLoggedinUser()
        savedTask = await storageService.post(STORAGE_KEY, task)
    }
    return savedTask
}

async function addTaskMsg(taskId, txt) {
    // Later, this is all done by the backend
    const task = await getById(taskId)
    if (!task.msgs) task.msgs = []

    const msg = {
        id: utilService.makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    task.msgs.push(msg)
    await storageService.put(STORAGE_KEY, task)

    return msg
}

function getEmptyTask() {
    return {
        id: utilService.makeId(),
        title: '',
        // creator: '',
        // collaborators: '',
        status: '',
        duration: '',
        timeline: '',
        priority: '',
        txt: '',
        // comments: [],
        createdAt: Date.now(),
    }
}

// "tasks": [
//     {
//         "id": "c103",
//         "title": "Do that",
//         "archivedAt": 1589983468418,
//     },
//     {
//         "id": "c104",
//         "title": "Help me",
//         "status": "in-progress", // monday
//         "priority": "high",
//         "description": "description",
//         "comments": [
//             {
//                 "id": "ZdPnm",
//                 "txt": "also @yaronb please CR this",
//                 "createdAt": 1590999817436,
//                 "byMember": {
//                     "_id": "u101",
//                     "fullname": "Tal Tarablus",
//                     "imgUrl": "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg"
//                 }
//             }
//         ],
//         "checklists": [
//             {
//                 "id": "YEhmF",
//                 "title": "Checklist",
//                 "todos": [
//                     {
//                         "id": "212jX",
//                         "title": "To Do 1",
//                         "isDone": false
//                     }
//                 ]
//             }
//         ]

// export function TaskPreview({ task }) {
//     //GET FROM STORE
//     const cmpsOrder = [
//       "status-picker",
//       "member-picker",
//       "date-picker",
//       "priority-picker",
//     ];
//     return (
//       <section>
//         <h5>{task.txt}</h5>
//         {cmpsOrder.map((cmp, idx) => {
//           return (
//             <DynamicCmp
//               cmp={cmp}
//               key={idx}
//               onUpdate={(data) => {
//                 console.log("Updating: ", cmp, "with data:", data);
//                 // make a copy, update the task, create an action
//                 // Call action: updateTask(task, action)
//               }}
//             />
//           );
//         })}
//       </section>
//     );
//   }