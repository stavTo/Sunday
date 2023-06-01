import { EMPTY_PERSON } from '../../assets/icons/icons'

export function MemberPicker({ type, task }) {
	return (
		<li className="member-picker">
			{task?.memberIds}
			<img src={EMPTY_PERSON} alt="person" />
		</li>
	)
}
