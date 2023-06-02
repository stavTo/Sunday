import { useEffect, useState } from 'react'
import { EMPTY_PERSON } from '../../assets/icons/icons'

export function MemberPicker({ type, task }) {
	const [isPickerOpen, setIsPickerOpen] = useState(false)

	useEffect(() => {
		document.addEventListener('mousedown', onClosePicker)
		return () => {
			document.removeEventListener('mousedown', onClosePicker)
		}
	}, [])

	function onClosePicker(ev) {
		if (!ev.target.closest('.member-picker-modal')) setIsPickerOpen(false)
	}

	return (
		<li
			className="member-picker"
			onClick={() => {
				setIsPickerOpen(true)
			}}>
			{task?.memberIds}
			<img src={EMPTY_PERSON} alt="person" />
			{isPickerOpen && (
				<div className="member-picker-modal">
					<input type="text" placeholder="Search names" />
					<ul className="members-list clean-list">
						<span>Suggested people</span>
						<li>Member1</li>
						<li>Member2</li>
						<li>Member3</li>
					</ul>
				</div>
			)}
		</li>
	)
}
