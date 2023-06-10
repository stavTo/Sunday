import { ICON_CHECKBOX } from '../assets/icons/icons'

export function TaskSelection({ onCheck, isChecked, isDisabled }) {
	return (
		<li className="task-selection">
			<label className="task-selection-label">
				<div className={`checkbox ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}`}>
					<input
						type="checkbox"
						onChange={() => onCheck(!isChecked)}
						disabled={isDisabled}
						checked={isChecked}
					/>
					{isChecked && <span className="checked-icon">{ICON_CHECKBOX}</span>}
				</div>
			</label>
		</li>
	)
}
