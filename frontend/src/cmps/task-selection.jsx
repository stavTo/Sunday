import { ICON_CHECKBOX } from '../assets/icons/icons'

export function TaskSelection({ onCheck, isChecked, isDisabled }) {
	return (
		<li className="task-selection">
			<div className="checkbox"></div>
			<input type="checkbox" onChange={() => onCheck(!isChecked)} disabled={isDisabled} checked={isChecked} />
		</li>
	)
}
