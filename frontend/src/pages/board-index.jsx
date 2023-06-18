import { useEffect, useRef, useState } from 'react'
import { SideBar } from '../cmps/side-bar'
import { loadBoards } from '../store/board.actions'
import { useSelector, useDispatch } from 'react-redux'
import { showErrorMsg } from '../services/event-bus.service'
import { BoardLoader } from '../cmps/board-loader'
import { BoardIndexHeader } from '../cmps/index-cmps/board-index-header'
import { BoardList } from '../cmps/index-cmps/board-list'
import { BoardIndexAside } from '../cmps/index-cmps/BoardIndexAside'
import { IndexInbox } from '../cmps/index-cmps/IndexInbox.jsx'
import { ICON_CLOSE } from '../assets/icons/icons'
import { boardService } from '../services/board.service'
import { useNavigate } from 'react-router-dom'
import { ParticleContainer } from '../cmps/particle-container'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { AiLoader } from '../cmps/ai-loader'
import { ADD_BOARD } from '../store/board.reducer'

export function BoardIndex() {
	const boards = useSelector(({ boardModule }) => boardModule.boards)
	const [toggleInputModal, setToggleInputModal] = useState(false)
	const [aiQuery, setAiQuery] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const generateTimeout = useRef(false)
	const inputRef = useRef('')
	const modalRef = useRef(null)
	const box1Ref = useRef(null)
	const box2Ref = useRef(null)

	useEffect(() => {
		onLoadBoards()
		document.title = 'My Boards'
	}, [])

	useEffect(() => {
		if (generateTimeout.current) navigateToAIBoard()
	}, [boards])

	useEffect(() => {
		if (toggleInputModal) {
			const modal = modalRef.current
			const box1 = box1Ref.current
			const box2 = box2Ref.current

			if (modal && box1 && box2) {
				function boxMove(e, box, speed) {
					let x = (window.innerWidth - e.pageX * speed) / 100
					let y = (window.innerHeight - e.pageY * speed) / 100
					box.style.transform = `translateX(${x}px) translateY(${y}px)`
				}

				document.addEventListener('mousemove', e => {
					boxMove(e, box1, 2)
					boxMove(e, box2, 2)
				})

				return () => {
					document.removeEventListener('mousemove', e => {
						boxMove(e, box1, 2)
						boxMove(e, box2, 2)
					})
				}
			}
		}
	}, [toggleInputModal])

	useEffect(() => {
		if (aiQuery) getBoardFromAI()
	}, [aiQuery])

	async function onLoadBoards() {
		try {
			await loadBoards()
		} catch {
			showErrorMsg(`Board could not be loaded`)
		}
	}

	function handleSubmit(ev) {
		ev.preventDefault()
		setAiQuery(inputRef.current.value)
	}

	function _getAiInstructions() {
		return [
			{
				role: 'system',
				content: `
		You are an AI assistant helping with the creation of project management templates for a project management app. Please provide in your response ONLY a valid JSON string that can be parsed back to an object that includes the board name, groups, and tasks based on the given user input. the tasks and the division of groups must be realted to the subject of the theme that the user has entered. You MUST not reply in any other way that is not according to the following format: "{"title":\"Board Name\","groups":[{"title":\"Group Name\","tasks":[{"title":\"Task description1\"},{"title":\"Task description2\"},{"title":\"Task description3\"}]}]}". You MUST send it in a valid JSON format, DO NOT forget to wrap ALL keys and their values with apostrophes (i.e ").`,
			},
			{ role: 'user', content: `My projects theme is: ${aiQuery}` },
		]
	}

	async function getBoardFromAI() {
		setIsLoading(true)
		try {
			const boardAi = await boardService.sendAPIRequest(aiQuery)
			console.log("boardAi:", boardAi)
			dispatch({ type: ADD_BOARD, board: boardAi })
			navigate(`/boards/${boardAi._id}`)
		} catch (err) {
			showErrorMsg(`Couldn't add AI board`)
		} finally {
			setIsLoading(false)
		}
	}

	// async function createAiBoard(aiBoard) {
	// 	const board = boardService.getEmptyBoard()
	// 	const task = boardService.getEmptyTask()

	// 	board.title = aiBoard.title

	// 	const aiGroups = aiBoard.groups.map(aiGroup => {
	// 		const group = {
	// 			...aiGroup,
	// 			id: utilService.makeId(),
	// 			style: { color: utilService.getRandomColor() },
	// 		}

	// 		const aiTasks = group.tasks.map(aiTask => ({
	// 			...task,
	// 			...aiTask,
	// 			id: utilService.makeId(),
	// 		}))

	// 		group.tasks = aiTasks
	// 		return group
	// 	})

	// 	board.groups.push(...aiGroups)
	// 	addBoard(board)

	// 	setIsLoading(prevIsLoading => !prevIsLoading)
	// 	generateTimeout.current = true
	// }

	function navigateToAIBoard() {
		navigate(`/boards/${boards[boards.length - 1]._id}`)
		generateTimeout.current = false
	}

	if (!boards) return <BoardLoader />

	return (
		<>
			{toggleInputModal && <div className="index-back-panel"></div>}
			<section className="board-index">
				{toggleInputModal && <ParticleContainer />}
				<SideBar />
				<section className="index-body">
					<section className="index-container">
						<div className="header-wrapper">
							<BoardIndexHeader setToggleInputModal={setToggleInputModal} />
						</div>
						<section className="boards-list">
							<BoardList boards={boards} />
							<IndexInbox />
						</section>
						<BoardIndexAside
							setToggleInputModal={setToggleInputModal}
							toggleInputModal={toggleInputModal}
						/>
					</section>
					{toggleInputModal && (
						<div className={`template-modal flex column ${isLoading ? 'expanded' : ''}`} ref={modalRef}>
							<form onSubmit={handleSubmit} className="flex column justify-center ai-form">
								<h2>Generate new boards with powerful AI templates</h2>
								<div className="input-container">
									<input
										autoComplete="off"
										type="text"
										placeholder="Write your prompt..."
										ref={inputRef}
									/>
									<button className="submit-btn pointer" type="submit">
										<FontAwesomeIcon icon={faPaperPlane} />
									</button>
								</div>
								{isLoading && <AiLoader />}
							</form>
							<button
								className="close-btn btn-primary flex pointer"
								onClick={() => setToggleInputModal(toggleInputModal => !toggleInputModal)}>
								{ICON_CLOSE}
							</button>
							<div className="box-1" ref={box1Ref}></div>
							<div className="box-2" ref={box2Ref}></div>
						</div>
					)}
				</section>
			</section>
		</>
	)
}
