import { useState, useEffect } from 'react'
import { format, parseJSON } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import { useSelector } from 'react-redux'
import 'react-day-picker/dist/style.css'
import { saveTask } from '../../store/selected-board.actions'

import { ICON_CLOSE } from '../../assets/icons/icons'

// ** Positioning calendar patch edit imports-related stuff

import React, { ChangeEventHandler, useRef } from 'react'

import { isValid, parse } from 'date-fns'
import FocusTrap from 'focus-trap-react'
import { usePopper } from 'react-popper'

export function DatePicker({ task, groupId }) {
	const [selected, setSelected] = useState(null)
	const [isHovered, setIsHovered] = useState(false)
	const [toggle, setToggle] = useState(false)
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)

	const boxRef = useRef()
	const tooltipRef = useRef()
	const { styles, attributes } = usePopper(boxRef.current, tooltipRef.current)

	// **POPPER SECTION START
	// const [inputValue, setInputValue] = useState('');
	// const [isPopperOpen, setIsPopperOpen] = useState(false);

	// const popperRef = useRef(null);
	// const buttonRef = useRef(null);
	// const [popperElement, setPopperElement] = useState(null);

	// const popper = usePopper(popperRef.current, popperElement, {
	// 	placement: 'bottom'
	// });

	// const closePopper = () => {
	// 	setIsPopperOpen(false);
	// 	buttonRef?.current?.focus();
	// };

	// const handleInputChange = (e) => {
	// 	setInputValue(e.currentTarget.value);
	// 	const date = parse(e.currentTarget.value, 'y-MM-dd', new Date());
	// 	if (isValid(date)) {
	// 		setSelected(date);
	// 	} else {
	// 		setSelected(undefined);
	// 	}
	// };

	// const handleButtonClick = () => {
	// 	setIsPopperOpen(true);
	// };

	// const handleDaySelect = (date) => {
	// 	setSelected(date);
	// 	if (date) {
	// 		setInputValue(format(date, 'y-MM-dd'));
	// 		closePopper();
	// 	} else {
	// 		setInputValue('');
	// 	}
	// };

	// **POPPER SECTION END

	useEffect(() => {
		if (selected) {
			onChangeDueDate()
			setToggle(!toggle)
		}
	}, [selected])

	async function onChangeDueDate() {
		const taskToEdit = { ...task, dueDate: selected }
		await saveTask(board._id, groupId, taskToEdit, '')
	}

	async function clearTaskDueDate() {
		const taskToEdit = { ...task, dueDate: null }
		await saveTask(board._id, groupId, taskToEdit, '')
	}

	let footer = <p>Please pick a day.</p>
	if (selected) {
		footer = <p>You picked {format(selected, 'PP')}.</p>
	}

	return (
		<>
			<li
				className="date-picker flex align-center"
				ref={boxRef}
				// <li className="date-picker flex align-center" onClick={() => setToggle(!toggle)}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}>
				<div className="date-preview-container flex align-center justify-center">
					{task.dueDate && (
						<div className="span-container flex align-center justify-center">
							<span className="date-preview">
								{new Date(task.dueDate).toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric',
								})}
							</span>
							{isHovered && (
								<div
									className="reset-date-btn flex align-center justify-end"
									onClick={() => clearTaskDueDate()}>
									{ICON_CLOSE}
								</div>
							)}
						</div>
					)}
				</div>
			</li>
			{toggle && (
				<div className="date-picker-container" ref={tooltipRef} style={styles.popper} {...attributes.popper}>
					<DayPicker mode="single" selected={selected} onSelect={setSelected} footer={footer} />
				</div>
			)}
		</>
	)
}
