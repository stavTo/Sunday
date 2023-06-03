import { useState } from 'react'
import { ICON_EXPAND_ARROW, ICON_OPTIONS } from '../assets/icons/icons'
import { setTippy } from '../services/tippy.service'
import { TaskList } from './task-list'
import { updateGroup } from '../store/selected-board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { useSelector } from 'react-redux'

export function GroupPreview({ group }) {
	const [isInputVisible, setIsInputVisible] = useState(false)
	const [titleToChange, setTitleToChange] = useState(group.title)
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)
	setTippy('.group-title', 'Click to Edit', 'top', [0, 20])

	function handleTitleClick() {
		setIsInputVisible(true)
	}

	function handleChange({ target }) {
		setTitleToChange(target.value)
	}

	function setGroupTitle() {
		setIsInputVisible(false)
		const newGroup = { ...group, title: titleToChange }
		try {
			updateGroup(board._id, newGroup)
		} catch {
			showErrorMsg('Cant update')
		}
	}

	return (
		<section className="group-preview">
			<div className="group-header" style={{ color: group.style.color }}>
				<div className="expand-arrow-container">{ICON_EXPAND_ARROW}</div>
				<div className="group-title-container" onClick={handleTitleClick}>
					{!isInputVisible && <h4 className="group-title">{group.title}</h4>}
					{isInputVisible && (
						<input
							className="group-title-input"
							autoFocus
							type="text"
							value={titleToChange}
							onChange={handleChange}
							onBlur={setGroupTitle}></input>
					)}
				</div>
				<div className="task-count">{group.tasks?.length} Tasks</div>
			</div>
			<TaskList group={group} tasks={group.tasks} />
		</section>
	)
}
