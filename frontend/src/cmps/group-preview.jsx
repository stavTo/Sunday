import { useEffect, useState } from 'react'
import { ICON_EXPAND_ARROW, ICON_OPTIONS } from '../assets/icons/icons'
import { TaskList } from './task-list'
import { updateGroup, removeGroup } from '../store/selected-board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { useSelector } from 'react-redux'
import { TippyContainer } from './tippy-container'
import { OptionsMenu } from './options-menu'
import { ColorPicker } from './color-picker'

export function GroupPreview({ group }) {
	const [isInputVisible, setIsInputVisible] = useState(false)
	const [isOptionOpen, setIsOptionOpen] = useState(false)
	const [titleToChange, setTitleToChange] = useState(group.title)
	const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)

	useEffect(() => {
		document.addEventListener('click', onSetOptionClose)
		return () => {
			document.removeEventListener('click', onSetOptionClose)
		}
	}, [])

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

	function setGroupStyle(newStyle) {
		const newGroup = { ...group, style: newStyle }
		try {
			updateGroup(board._id, newGroup)
		} catch {
			showErrorMsg('Cant update style')
		}
	}

	function onSetOptionClose(ev) {
		if (ev.target.closest('.group-option , .options-menu')) return
		setIsOptionOpen(false)
	}

	function onSetColorPickerClose(ev) {
		if (ev.target.closest('.color-picker , .options-menu')) return
		setIsColorPickerOpen(false)
	}

	async function onRemoveGroup() {
		await removeGroup(board._id, group.id)
	}

	function openColorPicker() {
		setIsOptionOpen(false)
		setIsColorPickerOpen(true)
	}
	return (
		<section className="group-preview">
			<div className="group-header" style={{ color: group.style.color }}>
				<div className="group-option-container btn-primary flex align-center">
					<div className="group-option flex align-center" onClick={() => setIsOptionOpen(true)}>
						{ICON_OPTIONS}
					</div>
				</div>
				{isOptionOpen && (
					<OptionsMenu
						group={group}
						onRemoveGroup={onRemoveGroup}
						openColorPicker={openColorPicker}
						setIsOptionOpen={setIsOptionOpen} />
				)}
				{isColorPickerOpen && (
					<ColorPicker
						onSetColorPickerClose={onSetColorPickerClose}
						setGroupStyle={setGroupStyle} />
				)}
				<div className="expand-arrow-container">{ICON_EXPAND_ARROW}</div>
				<div className="group-title-container" onClick={handleTitleClick}>
					{!isInputVisible && (
						<TippyContainer txt="Click to Edit" offset={[0, 5]}>
							<h4 className="group-title">{group.title}</h4>
						</TippyContainer>
					)}
					{isInputVisible && (
						<input
							className="group-title-input"
							autoFocus
							type="text"
							value={titleToChange}
							onChange={handleChange}
							onBlur={setGroupTitle}
						></input>
					)}
				</div>
				<div className="task-count">{group.tasks?.length} Tasks</div>
			</div>
			<TaskList group={group} tasks={group.tasks} />
		</section>
	)
}
