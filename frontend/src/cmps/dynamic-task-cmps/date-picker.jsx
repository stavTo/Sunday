import React, { useState } from "react"
import { format } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import { useEffectUpdate } from "../../customHooks/useEffectUpdate"
import { useSelector } from "react-redux"
import 'react-day-picker/dist/style.css'

export function OpenCalendar({ task, groupId }) {
	const [selected, setSelected] = useState(new Date());
	const [toggle, setToggle] = useState(false)
	const [dueDate, setDueDate] = useState()
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)

	// useEffectUpdate(() => {
	// 	setDueDate(...prevDueDate, ...dueDate)
	// }, [])

	let footer = <p>Please pick a day.</p>;
	if (selected) {
		footer = <p>You picked {format(selected, 'PP')}.</p>;
	}
	console.log("dueDate:", dueDate)
	return (
		<>
			<li className="date-picker" onClick={() => setToggle(!toggle)}>
				<div className="date-preview">
					{dueDate &&
						<span>{dueDate}</span>
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
