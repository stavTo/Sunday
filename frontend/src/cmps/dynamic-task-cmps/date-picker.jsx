import { useState, useEffect } from "react"
import { format, parseJSON } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import { useSelector } from "react-redux"
import 'react-day-picker/dist/style.css'
import { updateDueDateInTask } from '../../store/selected-board.actions'

export function DatePicker({ task, groupId }) {
	// const [selectedDate, setSelectedDate] = useState(new Date());
	const [selected, setSelected] = useState(null)
	const [dueDate, setDueDate] = useState(false)
	const [toggle, setToggle] = useState(false)
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)

	function onChangeDueDate() {
		updateDueDateInTask(board._id, groupId, task.id, selected)
	}

	useEffect(() => {
		console.log("selected:", selected)
		if (selected) {
			onChangeDueDate()
			setToggle(!toggle)
		}
	}, [selected])

	let footer = <p>Please pick a day.</p>;
	if (selected) {
		footer = <p>You picked {format(selected, 'PP')}.</p>;
	}

	return (
		<>
			<li className="date-picker" onClick={() => setToggle(!toggle)}>
				<div className="date-preview-container flex align-center justify-center">
					{task.dueDate &&
						<span className="date-preview">{new Date(task.dueDate).toLocaleDateString('en-US', {
							month: 'short',
							day: 'numeric'
						})}</span>
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
