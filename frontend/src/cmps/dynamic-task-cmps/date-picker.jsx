import { useState, useEffect } from 'react'
import { format, parseJSON } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import { useSelector } from 'react-redux'
import 'react-day-picker/dist/style.css'
import { saveTask } from '../../store/selected-board.actions'

import { ICON_CLOSE, ICON_ADD_DATE } from "../../assets/icons/icons"


// ** Positioning calendar patch edit imports-related stuff

import { usePopper } from 'react-popper';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons"

export function DatePicker({ task, groupId }) {
	const [selected, setSelected] = useState()
	const [isHovered, setIsHovered] = useState(false)
	const [toggle, setToggle] = useState(false)
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)
	const [hasDate, setHasDate] = useState(task.dueDate)

	const [referenceElement, setReferenceElement] = useState(null)
	const [popperElement, setPopperElement] = useState(null)
	const [arrowElement, setArrowElement] = useState(null)
	const { styles, attributes } = usePopper(referenceElement, popperElement, {
		modifiers: [
			{ name: 'arrow', options: { element: arrowElement } },
			{ name: 'offset', options: { offset: [0, 8] } },
		],
	})

	useEffect(() => {
		document.addEventListener('mousedown', onClosePicker)
		return () => {
			document.removeEventListener('mousedown', onClosePicker)
		}
	}, [])

	function onClosePicker(ev) {
		if (ev.target.closest('.date-picker-container')) return
		setToggle(false)
	}

	function onToggleModal(ev) {
		if (ev.target.closest('.date-picker-container')) return
		ev.stopPropagation()
		setToggle(prev => !prev)
	}

	useEffect(() => {
		if (selected) {
			onChangeDueDate()
			setHasDate(task)
			setToggle(!toggle)
		}
	}, [selected])

	async function onChangeDueDate() {
		const taskToEdit = { ...task, dueDate: selected }
		await saveTask(board._id, groupId, taskToEdit, '')
	}

	async function clearTaskDueDate() {
		const taskToEdit = { ...task, dueDate: null }
		setHasDate(taskToEdit.dueDate)
		await saveTask(board._id, groupId, taskToEdit, '')
	}

	let footer = <p>Please pick a day.</p>
	if (selected) {
		footer = <p>You picked {format(selected, 'PP')}.</p>
	}

	return (
		<>
			<li className="date-picker flex align-center" ref={setReferenceElement}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}>
				<div className="date-preview-container flex align-center justify-center"
					onClick={ev => onToggleModal(ev)}>
					{isHovered && !hasDate &&
						<div className="add-date-btn pointer flex align-center justify-center">
							<FontAwesomeIcon icon={faCirclePlus} style={{ color: "#0073ea", }} />
							{ICON_ADD_DATE}
						</div>
					}
					{task.dueDate &&
						<div className="span-container flex align-center justify-center">
							<span className="date-preview">{new Date(task.dueDate).toLocaleDateString('en-US', {
								month: 'short',
								day: 'numeric'
							})}</span>
						</div>
					)}
				</div>
				{isHovered && hasDate &&
					<div className="reset-date-btn pointer flex align-center"
						onClick={() => clearTaskDueDate()}>
						{ICON_CLOSE}
					</div>
				}
				{toggle &&
					<div className="date-picker-container" ref={setPopperElement}>
						<DayPicker
							mode="single"
							selected={selected}
							onSelect={setSelected}
							footer={footer}
						/>
					</div>
				}
			</li>
		</>
	)
}
