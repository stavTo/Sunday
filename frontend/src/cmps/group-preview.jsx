import { useEffect, useState } from 'react'
import { ICON_EXPAND_ARROW, ICON_OPTIONS } from '../assets/icons/icons'
import { TaskList } from './task-list'
import { updateGroup, removeGroup } from '../store/selected-board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { useSelector } from 'react-redux'
import { TippyContainer } from './tippy-container'
import { GroupOptionsMenu } from './group-options-menu'
import { ColorPicker } from './color-picker'
import { GroupSummary } from './group-summary-cmps/group-summary'
import { TaskListHeader } from './task-list-header'
import { useEffectUpdate } from '../customHooks/useEffectUpdate'
import { socketService, SOCKET_EVENT_ADD_TASK } from '../services/socket.service'

export function GroupPreview({ group, provided }) {
	const [isInputVisible, setIsInputVisible] = useState(false)
	const [isOptionOpen, setIsOptionOpen] = useState(false)
	const [titleToChange, setTitleToChange] = useState(group.title)
	const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [isGroupSelected, setIsGroupSelected] = useState(false)
	const checkedTaskIds = useSelector(({ selectedTaskModule }) => selectedTaskModule.checkedTaskIds)
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)

	useEffect(() => {
		document.addEventListener('mousedown', onSetOptionClose)
		return () => {
			document.removeEventListener('mousedown', onSetOptionClose)
		}
	}, [])

	function handleKeyPressed(key) {
		if (key.key === 'Enter') setGroupTitle()
		if (key.key === 'Escape') onEmptyInput()
	}

	function onEmptyInput() {
		setTitleToChange(board.title)
		setIsInputVisible(false)
	}

	useEffectUpdate(() => {
		if (!checkedTaskIds.length) setIsGroupSelected(false)
	}, [checkedTaskIds])

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
		try {
			await removeGroup(board._id, group.id)
		} catch {
			showErrorMsg('Cant remove group')
		}
	}

	function openColorPicker() {
		setIsOptionOpen(false)
		setIsColorPickerOpen(true)
	}
	return (
		<section className={`group-preview ${isCollapsed ? 'collapsed' : ''}`}>
			{isOptionOpen && (
				<GroupOptionsMenu
					group={group}
					onRemoveGroup={onRemoveGroup}
					openColorPicker={openColorPicker}
					setIsOptionOpen={setIsOptionOpen}
				/>
			)}
			{isColorPickerOpen && (
				<ColorPicker
					onSetColorPickerClose={onSetColorPickerClose}
					setGroupStyle={setGroupStyle}
					setIsColorPickerOpen={setIsColorPickerOpen}
				/>
			)}
			<div className="group-sticky-background"></div>
			<div className="group-sticky-container">
				<div className="header-container">
					<div {...provided.dragHandleProps} className="group-header" style={{ color: group.style.color }}>
						<div className="group-option-container flex align-center">
							<div
								className="group-option btn-primary flex align-center"
								onClick={() => setIsOptionOpen(true)}
							>
								{ICON_OPTIONS}
							</div>
						</div>

						<div
							onClick={() => setIsCollapsed(prev => !prev)}
							className={`expand-arrow-container ${isCollapsed ? 'collapsed' : ''}`}
						>
							{ICON_EXPAND_ARROW}
						</div>
						<div className="group-title-container" onClick={handleTitleClick}>
							{!isInputVisible && (
								<TippyContainer txt="Click to Edit" offset={[0, 5]}>
									<h4 className="group-title">{group.title}</h4>
								</TippyContainer>
							)}
							{isInputVisible && (
								<input
									className="group-title-input"
									onKeyDown={handleKeyPressed}
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
				</div>

				<TaskListHeader
					isCollapsed={isCollapsed}
					group={group}
					tasks={group.tasks}
					isGroupSelected={isGroupSelected}
					setIsGroupSelected={setIsGroupSelected}
				/>
			</div>
			{!isCollapsed && <TaskList group={group} tasks={group.tasks} setIsGroupSelected={setIsGroupSelected} />}

			<GroupSummary group={group} isCollapsed={isCollapsed} />
			<div className="drag-handle" {...provided.dragHandleProps}></div>
		</section>
	)
}
