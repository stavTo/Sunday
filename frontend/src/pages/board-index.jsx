import { useEffect, useState } from 'react'
import { SideBar } from '../cmps/side-bar'
import { addBoard, loadBoards } from '../store/board.actions'
import { useSelector } from 'react-redux'
import { showErrorMsg } from '../services/event-bus.service'
import { BoardLoader } from '../cmps/board-loader'
import { BoardIndexHeader } from '../cmps/index-cmps/board-index-header'
import { BoardList } from '../cmps/index-cmps/board-list'
import { BoardIndexAside } from '../cmps/index-cmps/BoardIndexAside'
import { IndexInbox } from '../cmps/index-cmps/IndexInbox.jsx'
import { ICON_CLOSE } from '../assets/icons/icons'
// import { config } from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'
import { boardService } from '../services/board.service'
import { utilService } from '../services/util.service'

// config()

export function BoardIndex() {
	const boards = useSelector(({ boardModule }) => boardModule.boards)
	const [toggleInputModal, setToggleInputModal] = useState(false)
	const [aiQuery, setAiQuery] = useState('')
	const gptAnswers = []

	document.title = 'My Boards'

	useEffect(() => {
		onLoadBoards()
	}, [])

	async function onLoadBoards() {
		try {
			await loadBoards()
		} catch {
			showErrorMsg(`Board could not be loaded`)
		}
	}

	function handleChange(ev) {
		setAiQuery(ev.target.value)
	}

	function handleSubmit(ev) {
		ev.preventDefault();
		// sendToGpt()
		createNewBoard()
	}

	// const openai = new OpenAIApi(new Configuration({
	// 	apiKey: process.env.REACT_APP_API_KEY
	// }))

	// function getAiInstructions() {
	// 	return [{
	// 		"role": "system", "content": `
	// 	You are an AI assistant helping with the creation of project management templates for a project management app. Please provide in your response ONLY a valid JSON string that can be parsed back to an object that includes the board name, groups, and tasks based on the given user input. the tasks and the division of groups must be realted to the subject of the theme that the user has entered. You MUST not reply in any other way that is not according to the following format: {"boardName":"Board Name","groups":[{"title":"Group Name","tasks":[{"task": {"title": "Task description1}},"Task description2","Task description3"]}]}. You MUST send it in a valid JSON format, without redundant quotes or curly brackets/ regular brackets, so it will be possible to JSON.parse your response. DO NOT forget to wrap ALL keys and their values with apostrophes.`},
	// 	{ "role": "user", "content": `My projects theme is: ${aiQuery}` }]
	// }
	function getAiInstructions() {
		return [{
			"role": "system", "content": `
		You are an AI assistant helping with the creation of project management templates for a project management app. Please provide in your response ONLY a valid JSON string that can be parsed back to an object that includes the board name, groups, and tasks based on the given user input. the tasks and the division of groups must be realted to the subject of the theme that the user has entered. You MUST not reply in any other way that is not according to the following format: "{boardName:\"Board Name\",groups:[{title:\"Group Name\",tasks:[{title:\"Task description1\"},{title:\"Task description2\"},{title:\"Task description3\"}]}]}". You MUST send it in a valid JSON format, without redundant quotes or curly brackets/ regular brackets, so it will be possible to JSON.parse your response. DO NOT forget to wrap ALL keys and their values with apostrophes.`},
		{ "role": "user", "content": `My projects theme is: ${aiQuery}` }]
	}

	async function sendToGpt() {
		const res = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			max_tokens: 1000,
			temperature: 0.3,
			messages: getAiInstructions()
		})
		const result = res.data.choices[0].message.content
		handleGptInstructions(result)
	}

	function handleGptInstructions(result) {
		console.log("JSON.parse(result):", JSON.parse(result))
		const res = JSON.parse(result)
		createNewBoard(res)
	}

	async function createNewBoard(aiBoard) {
		addBoard(boardService.getEmptyBoard())
		console.log("aiBoard:", aiBoard)
		const lastBoard = await boardService.getLastBoard()
		console.log("lastBoard:", lastBoard)

		lastBoard.title = aiBoard.boardName

		aiBoard.groups.map(aiGroup => {
			boardService.addGroup(lastBoard._id, true, aiGroup.title)
			aiGroup.tasks.map(aiTask => {
				boardService.addTask(lastBoard._id)
				// boardId, groupId, task, action = {}
			})
		})

		// const emptyBoard = boardService.getEmptyBoard()
		// const emptyGroup = boardService.getEmptyGroup()
		// const emptyTask = boardService.getEmptyTask()


		// const board = emptyBoard.reduce((acc, entity) => {
		// 	const groupToAdd = {...emptyGroup, aiGroup}
		// 	acc.push(groupToAdd)
		// 	const task = { ...emptyTask,  }
		// }, [])
	}

	// function onCreateNewBoard(aiBoard) {
	// 	const board = boardService.getNewBoard()
	// 	console.log("aiBoard:", aiBoard)
	// 	board.title = aiBoard.boardName
	// 	board.groups.forEach(group => {
	// 		aiBoard.groups.map(aiGroup => {
	// 			group.title = aiGroup.groupName
	// 			group.tasks.map(task => {
	// 				aiGroup.tasks.map(aiTask => {
	// 					task.title = aiTask
	// 				})
	// 			})
	// 		})
	// 	})
	// 	addBoard(board)
	// }

	const Obj = {
		boardName: 'Board Name',
		groups: [
			{
				groupName: 'Group Name',
				tasks: [
					'Task description1',
					'Task description2',
					'Task description3']
			}]
	}

	if (!boards) return <BoardLoader />

	return (
		<section className="board-index">
			<SideBar isExpandable={false} />
			<section className="index-body">
				<section className="index-container">
					<div className="header-wrapper">
						<BoardIndexHeader />
					</div>
					<section className="boards-list">
						<BoardList boards={boards} />
						<IndexInbox />
					</section>
					<BoardIndexAside setToggleInputModal={setToggleInputModal} toggleInputModal={toggleInputModal} />
				</section>
				{toggleInputModal &&
					<div className="template-modal">
						<h1>To create a new board with a ready-made template, please insert your desired template</h1>
						<form onSubmit={handleSubmit}>
							<input
								className="filter-search-input"
								type="search"
								placeholder="Enter a description regarding your project"
								name="txt"
								value={aiQuery}
								onChange={handleChange}
							/>
							<button className="submit-btn btn-primary pointer" type="submit">Submit</button>
						</form>
						<button className="close-btn btn-primary flex pointer" onClick={() => setToggleInputModal(toggleInputModal => !toggleInputModal)}>
							{ICON_CLOSE}
						</button>
					</div>
				}
			</section>
		</section>
	)
}
