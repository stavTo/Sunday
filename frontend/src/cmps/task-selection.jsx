import { ICON_CHECKBOX } from '../assets/icons/icons'

export function TaskSelection({ onSelect, isSelected, isDisabled }) {
	return <li className="task-selection">{ICON_CHECKBOX}</li>
}
