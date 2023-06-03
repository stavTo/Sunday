import { useState, useEffect } from "react"
import { format, parseJSON } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import { useSelector } from "react-redux"
import 'react-day-picker/dist/style.css'
import { saveTask } from '../../store/selected-board.actions'

import { ICON_CLOSE } from "../../assets/icons/icons"

export function DatePicker({ task, groupId }) {
	const [selected, setSelected] = useState(null)
	const [isHovered, setIsHovered] = useState(false)
	const [toggle, setToggle] = useState(false)
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)

	useEffect(() => {
		if (selected) {
			onChangeDueDate()
			setToggle(!toggle)
		}
	}, [selected])


	async function onChangeDueDate() {
		const taskToEdit = {...task, dueDate: selected}
		await saveTask(board._id, groupId, taskToEdit, '')
	}

	async function clearTaskDueDate() {
		const taskToEdit = {...task, dueDate: null}
		await saveTask(board._id, groupId, taskToEdit, '')
	}

	let footer = <p>Please pick a day.</p>
	if (selected) {
		footer = <p>You picked {format(selected, 'PP')}.</p>
	}

	return (
		<>
			<li className="date-picker flex align-center" onClick={() => setToggle(!toggle)}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}>
				<div className="date-preview-container flex align-center justify-center">
					{task.dueDate &&
						<div className="span-container flex align-center justify-center">
							<span className="date-preview">{new Date(task.dueDate).toLocaleDateString('en-US', {
								month: 'short',
								day: 'numeric'
							})}</span>
							{isHovered &&
								<div className="reset-date-btn flex align-center justify-end"
									onClick={() => clearTaskDueDate()}>
									{ICON_CLOSE}
								</div>
							}
						</div>
					}
				</div>
			</li>
			{toggle &&
				<div className="date-picker-container">
					<DayPicker
						mode="single"
						selected={selected}
						onSelect={setSelected}
						footer={footer}
					/>
				</div>
			}
		</>
	)
}
