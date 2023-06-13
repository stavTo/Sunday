import { useEffect, useState } from 'react'
import { ICON_EXPAND_ARROW, ICON_OPTIONS } from '../assets/icons/icons'
import { TaskList } from './task-list'
import { updateGroup, removeGroup, addGroup } from '../store/selected-board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { useSelector } from 'react-redux'
import { TippyContainer } from './tippy-container'
import { GroupOptionsMenu } from './group-options-menu'
import { ColorPicker } from './color-picker'
import { GroupSummary } from './group-summary-cmps/group-summary'
import { TaskListHeader } from './task-list-header'
import { useEffectUpdate } from '../customHooks/useEffectUpdate'
import { usePopper } from 'react-popper'
import { useLongPress } from '../customHooks/useLongPress'

export function GroupPreview({ group, provided, isGroupCollapsed, setAllGroupsCollapsed }) {
	const [isInputVisible, setIsInputVisible] = useState(false)
	const [isOptionOpen, setIsOptionOpen] = useState(false)
	const [titleToChange, setTitleToChange] = useState(group.title)
	const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
	const [isCollapsed, setIsCollapsed] = useState(isGroupCollapsed)
	const [isGroupSelected, setIsGroupSelected] = useState(false)
	const checkedTaskIds = useSelector(({ selectedTaskModule }) => selectedTaskModule.checkedTaskIds)
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)
	const [referenceElement, setReferenceElement] = useState(null)
	const [popperElement, setPopperElement] = useState(null)
	const { styles, attributes } = usePopper(referenceElement, popperElement)

	useEffect(() => {
		document.addEventListener('mousedown', onSetOptionClose)
		return () => {
			document.removeEventListener('mousedown', onSetOptionClose)
		}
	}, [])

	useEffect(() => {
		setIsCollapsed(isGroupCollapsed)
	}, [isGroupCollapsed])

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
			const action = {
				description: group.title,
				newGroupTitle: newGroup.title,
				groupColor: board.groups[0].style.color,
				type: 'Rename group',
			}
			updateGroup(board._id, newGroup, action)
		} catch {
			showErrorMsg('Cant update')
		}
	}

	function setGroupStyle(newStyle) {
		const newGroup = { ...group, style: newStyle }
		try {
			const action = {
				description: group.title,
				newGroupColor: newGroup.style.color,
				groupColor: group.style.color,
				type: 'Group color changed',
			}
			updateGroup(board._id, newGroup, action)
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

	function onAddGroup() {
		addGroup(board._id, false)
	}

	async function onRemoveGroup() {
		try {
			const action = {
				description: 'Deleted group',
				groupTitle: group.title,
				groupColor: group.style.color,
				type: 'Deleted group',
			}
			await removeGroup(board._id, group.id, action)
		} catch {
			showErrorMsg('Cant remove group')
		}
	}

	function openColorPicker() {
		setIsOptionOpen(false)
		setIsColorPickerOpen(true)
	}

	function onLongPress() {
		setIsOptionOpen(true)
	}

	const longPressEvent = useLongPress(onLongPress, () => {}, {
		shouldPreventDefault: false,
	})

	return (
		<>
			<section className={`group-preview ${isCollapsed ? 'collapsed' : ''}`}>
				{isOptionOpen && (
					<div
						className="popper-container"
						ref={setPopperElement}
						style={styles.popper}
						{...attributes.popper}
					>
						<GroupOptionsMenu
							isGroupSelected={isGroupSelected}
							setIsGroupSelected={setIsGroupSelected}
							setIsCollapsed={setIsCollapsed}
							group={group}
							onRemoveGroup={onRemoveGroup}
							openColorPicker={openColorPicker}
							setIsOptionOpen={setIsOptionOpen}
							onAddGroup={onAddGroup}
						/>
					</div>
				)}
				{isColorPickerOpen && (
					<div
						className="popper-container"
						ref={setPopperElement}
						style={styles.popper}
						{...attributes.popper}
					>
						<ColorPicker
							onSetColorPickerClose={onSetColorPickerClose}
							setEntityStyle={setGroupStyle}
							setIsColorPickerOpen={setIsColorPickerOpen}
						/>
					</div>
				)}
				<div className="group-sticky-background"></div>
				<div className="group-sticky-container">
					<div className="header-container" {...longPressEvent}>
						<div
							{...provided.dragHandleProps}
							className="group-header"
							style={{ color: group.style.color }}
						>
							<div className="group-option-container flex align-center" ref={setReferenceElement}>
								<div
									className="group-option btn-primary flex align-center"
									onClick={() => setIsOptionOpen(true)}
								>
									{ICON_OPTIONS}
								</div>
							</div>
							{isCollapsed && (
								<div
									className="collapsed-colored-border-top"
									style={{ backgroundColor: group.style.color }}
								></div>
							)}
							<div
								onClick={() => setIsCollapsed(prev => !prev)}
								className={`expand-arrow-container ${isCollapsed ? 'collapsed' : ''}`}
							>
								{ICON_EXPAND_ARROW}
							</div>
							<div className="title-count-container">
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
						<div
							className="drag-handle"
							onMouseDown={() => setAllGroupsCollapsed(true)}
							onMouseUp={() => setAllGroupsCollapsed(false)}
							{...provided.dragHandleProps}
						></div>
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

				<GroupSummary provided={provided} group={group} isCollapsed={isCollapsed} />
			</section>
		</>
	)
}
