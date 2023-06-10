import { faDownLeftAndUpRightToCenter, faSquareCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { duplicateGroup } from '../store/selected-board.actions'
import { useParams } from 'react-router'
import { ICON_ADD_GROUP, ICON_DUPLICATE, ICON_TRASH } from '../assets/icons/icons'

export function GroupOptionsMenu({ onRemoveGroup, openColorPicker, group, setIsOptionOpen, onAddGroup }) {
	const { boardId } = useParams()

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

	return (
		<section className="options-menu group-options-menu">
			<div className="btn-primary">
				<span className="option-group-icon icon-font-awesome">
					<FontAwesomeIcon
						icon={faDownLeftAndUpRightToCenter}
						style={{ color: '#676879', rotate: '-45deg' }}
					/>
				</span>
				<span className="title">Collapse group</span>
			</div>
			<div className="btn-primary">
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
