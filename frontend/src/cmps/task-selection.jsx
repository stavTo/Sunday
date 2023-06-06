import { ICON_CHECKBOX } from '../assets/icons/icons'

export function TaskSelection({ onCheck, isChecked, isDisabled }) {
	return (
		<li className="task-selection">
			<div className={`checkbox ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}`}>
				<label className="task-selection-label">
					<input
						type="checkbox"
						onChange={() => onCheck(!isChecked)}
						disabled={isDisabled}
						checked={isChecked}
					/>
				</label>
				{isChecked && <span className="checked-icon">{ICON_CHECKBOX}</span>}
			</div>
		</li>
	)
}
