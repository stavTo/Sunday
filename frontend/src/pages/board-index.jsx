import { useEffect, useRef, useState } from 'react'
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
import { Configuration, OpenAIApi } from 'openai'
import { boardService } from '../services/board.service'
import { utilService } from '../services/util.service'
import { Dna } from 'react-loader-spinner'
import boardLoader from '../assets/img/board-loader.gif'
import { useNavigate } from 'react-router-dom'

export function BoardIndex() {
	const boards = useSelector(({ boardModule }) => boardModule.boards)
	const [toggleInputModal, setToggleInputModal] = useState(false)
	const [aiQuery, setAiQuery] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const navigate = useNavigate()
	const generateTimeout = useRef(false)

	document.title = 'My Boards'

	useEffect(() => {
		onLoadBoards()
		document.title = 'My Boards'
	}, [])

	useEffect(() => {
		if (generateTimeout.current) navigateNoder()
	}, [boards])

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
		ev.preventDefault()
		// sendToGpt()
		navigateToAIBoard()
	}


	const openai = new OpenAIApi(new Configuration({
		apiKey: process.env.REACT_APP_OPENAI_API_KEY
	}))

	function getAiInstructions() {
		return [{
			"role": "system", "content": `
		You are an AI assistant helping with the creation of project management templates for a project management app. Please provide in your response ONLY a valid JSON string that can be parsed back to an object that includes the board name, groups, and tasks based on the given user input. the tasks and the division of groups must be realted to the subject of the theme that the user has entered. You MUST not reply in any other way that is not according to the following format: "{"title":\"Board Name\","groups":[{"title":\"Group Name\","tasks":[{"title":\"Task description1\"},{"title":\"Task description2\"},{"title":\"Task description3\"}]}]}". You MUST send it in a valid JSON format, DO NOT forget to wrap ALL keys and their values with apostrophes (i.e ").`},
		{ "role": "user", "content": `My projects theme is: ${aiQuery}` }]
	}

	async function sendToGpt() {
		setIsLoading(prevIsLoading => !prevIsLoading)
		console.log("isLoading:", isLoading)
		try {
			const res = await openai.createChatCompletion({
				model: "gpt-3.5-turbo",
				max_tokens: 1000,
				temperature: 0.5,
				messages: getAiInstructions()
			})
			const response = res.data.choices[0].message.content
			const aiBoard = JSON.parse(response)
			createAiBoard(aiBoard)
			await setInterval(setIsLoading(prevIsLoading => !prevIsLoading), 1000)
		} catch (err) {
			console.log("err:", err)
		} finally {
			setIsLoading(false)
		}
	}

	async function createAiBoard() {
		setIsLoading(prevIsLoading => !prevIsLoading)

		setTimeout(() => {
			const aiBoard = {
				title: "Amusement Park Project",
				groups: [
					{
						title: "Planning",
						tasks: [
							{
								title: "Research amusement park design trends"
							},
							{
								title: "Determine budget for amusement park"
							},
							{
								title: "Create a list of potential rides and attractions"
							},
							{
								title: "Select a location for the amusement park"
							}
						]
					},
					{
						title: "Construction",
						tasks: [
							{
								title: "Hire a construction company"
							},
							{
								title: "Design the layout of the amusement park"
							},
							{
								title: "Build the rides and attractions"
							},
							{
								title: "Install utilities such as electricity and plumbing"
							}
						]
					},
					{
						title: "Marketing",
						tasks: [
							{
								title: "Develop a marketing plan"
							},
							{
								title: "Create a website for the amusement park"
							},
							{
								title: "Advertise the amusement park on social media"
							},
							{
								title: "Partner with local businesses to promote the amusement park"
							}
						]
					},
					{
						title: "Operations",
						tasks: [
							{
								title: "Hire staff for the amusement park"
							},
							{
								title: "Train staff on safety procedures"
							},
							{
								title: "Create a schedule for staff"
							},
							{
								title: "Purchase food and supplies for the amusement park"
							}
						]
					}
				]
			}
			console.log("aiBoard:", aiBoard)

			const board = boardService.getEmptyBoard()
			const task = boardService.getEmptyTask()

			board.title = aiBoard.title

			const aiGroups = aiBoard.groups.map(aiGroup => {
				const group = {
					...aiGroup,
					id: utilService.makeId(),
					style: { color: utilService.getRandomColor() }
				}

				const aiTasks = group.tasks.map(aiTask => ({
					...task,
					...aiTask,
					id: utilService.makeId()
				}))

				group.tasks = aiTasks
				return group
			})

			board.groups.push(...aiGroups)
			addBoard(board)


			setIsLoading(prevIsLoading => !prevIsLoading)
			generateTimeout.current = true
		}, 3000)
	}

	async function navigateToAIBoard() {
		await createAiBoard()
	}

	function navigateNoder() {
		navigate(`/boards/${boards[boards.length - 1]._id}`)
		generateTimeout.current = false
	}

	// async function navigateToAIBoard() {
	// 	const lastBoard = await boardService.getLastBoard()
	// 	navigate(`/boards/${lastBoard._id}`)
	// }

	if (!boards) return <BoardLoader />

	return (
		<section className="board-index">
			<SideBar isExpandable={false} />
			<section className="index-body">
				<section className="index-container">
					<div className="header-wrapper">
						<BoardIndexHeader setToggleInputModal={setToggleInputModal} />
					</div>
					<section className="boards-list">
						<BoardList boards={boards} />
						<IndexInbox />
					</section>
					<BoardIndexAside setToggleInputModal={setToggleInputModal} toggleInputModal={toggleInputModal} />
				</section>
				{toggleInputModal &&
					<div className={`${isLoading ? 'expanded template-modal flex column' : 'template-modal flex column'}`}>
						<form onSubmit={handleSubmit} className="flex column justify-center ai-form">
							<h1>To create a new board with a powerful template, enter a few details regarding your project</h1>
							<input
								autoComplete="off"
								className="filter-search-input"
								type="search"
								placeholder="Enter a description regarding your project"
								name="txt"
								value={aiQuery}
								onChange={handleChange}
							/>
							{isLoading &&
								<img className="ai-load" src={boardLoader} alt="Loader" />}
							<button className="submit-btn btn-primary pointer" type="submit">Submit</button>
							<button className="submit-btn btn-primary pointer" type="submit">
								Submit
							</button>
						</form>
						<button
							className="close-btn btn-primary flex pointer"
							onClick={() => setToggleInputModal(toggleInputModal => !toggleInputModal)}
						>
							{ICON_CLOSE}
						</button>
					</div>
				}
			</section>
		</section>
	)
}
