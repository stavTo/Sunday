import { faDownLeftAndUpRightToCenter, faSquareCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { duplicateGroup } from '../store/selected-board.actions'
import { useParams } from 'react-router'
import { ICON_ADD_GROUP, ICON_DUPLICATE, ICON_TRASH } from '../assets/icons/icons'
import { ADD_CHECKED_TASKS, REMOVE_CHECKED_TASKS } from '../store/selected-task.reducer'
import { useDispatch } from 'react-redux'

export function GroupOptionsMenu({
	onRemoveGroup,
	openColorPicker,
	group,
	setIsOptionOpen,
	onAddGroup,
	setIsCollapsed,
	setIsGroupSelected,
	isGroupSelected,
}) {
	const { boardId } = useParams()
	const dispatch = useDispatch()

	async function onDuplicateGroup() {
		setIsOptionOpen(false)
		const action = {
			description: 'Duplicate',
			groupColor: group.style.color,
			type: 'Group duplicated',
			groupTitle: group.title,
		}
		duplicateGroup(boardId, group, action)
	}

	function onCollapseGroup() {
		setIsCollapsed(prev => !prev)
		setIsOptionOpen(false)
	}

	function onSelectGroup() {
		const taskIds = group.tasks.map(task => task.id)
		if (isGroupSelected) {
			setIsGroupSelected(false)
			dispatch({ type: REMOVE_CHECKED_TASKS, taskIds })
		} else {
			setIsGroupSelected(true)
			dispatch({ type: ADD_CHECKED_TASKS, taskIds })
		}
		setIsOptionOpen(false)
	}

	return (
		<section className="options-menu group-options-menu">
			<div onClick={onCollapseGroup} className="btn-primary">
				<span className="option-group-icon icon-font-awesome">
					<FontAwesomeIcon
						icon={faDownLeftAndUpRightToCenter}
						style={{ color: '#676879', rotate: '-45deg' }}
					/>
				</span>
				<span className="title">Collapse group</span>
			</div>
			<div onClick={onSelectGroup} className="btn-primary">
				<span className="option-group-icon icon-font-awesome">
					<FontAwesomeIcon icon={faSquareCheck} style={{ color: '#676879' }} />{' '}
				</span>
				<span className="title">Select all tasks</span>
			</div>
			<div className="btn-primary" onClick={onAddGroup}>
				<span className="option-group-icon">{ICON_ADD_GROUP}</span>
				<span className="title"> Add group</span>
			</div>
			<div className="btn-primary" onClick={onDuplicateGroup}>
				<span className="option-group-icon">{ICON_DUPLICATE}</span>
				<span className="title"> Duplicate this group</span>
			</div>
			<div className="change-color btn-primary" onClick={openColorPicker}>
				<div className="option-group-icon color-icon" style={{ backgroundColor: group.style.color }}></div>
				<span className="title"> Change group color</span>
			</div>
			<div onClick={onRemoveGroup} className="remove-group btn-primary">
				<span className="option-group-icon">{ICON_TRASH}</span>
				<span className="title"> Delete group</span>
			</div>
		</section>
	)
}
