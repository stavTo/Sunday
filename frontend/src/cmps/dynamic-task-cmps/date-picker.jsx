import { useState, useEffect } from "react"
import { format, parseJSON } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import { useSelector } from "react-redux"
import 'react-day-picker/dist/style.css'
import { updateDueDateInTask } from '../../store/selected-board.actions'
import { saveTask } from '../../store/selected-board.actions'

export function DatePicker({ task, groupId }) {
	const [selected, setSelected] = useState(null)
	const [isHovered, setIsHovered] = useState(false)
	const [toggle, setToggle] = useState(false)
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)

	async function onChangeDueDate() {
		task.dueDate = selected
		// todo: לפרוס את הטאסק במקום לעשות השמה ישירה
		await saveTask(board._id, groupId, task, '')
		// updateDueDateInTask(board._id, groupId, task.id, selected)
	}

	useEffect(() => {
		if (selected) {
			onChangeDueDate()
			setToggle(!toggle)
		}
	}, [selected])

	let footer = <p>Please pick a day.</p>
	if (selected) {
		footer = <p>You picked {format(selected, 'PP')}.</p>
	}

	return (
		<>
			<li className="date-picker" onClick={() => setToggle(!toggle)}>
				<div className="date-preview-container flex align-center justify-center">
					{task.dueDate &&
						<div className="span-container flex align-center justify-center"
							onMouseEnter={() => setIsHovered(true)}
							onMouseLeave={() => setIsHovered(false)}>
							<span className="date-preview">{new Date(task.dueDate).toLocaleDateString('en-US', {
								month: 'short',
								day: 'numeric'
							})}</span>
							{isHovered &&
								<div className="reset-date-btn"></div>
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
