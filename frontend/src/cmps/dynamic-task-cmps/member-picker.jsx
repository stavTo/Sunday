import { useEffect, useRef, useState } from 'react'
import { ICON_CLOSE, ICON_SEARCH } from '../../assets/icons/icons'
import { EMPTY_PERSON } from '../../assets/icons/icons'

export function MemberPicker({ type, task }) {
	const [isPickerOpen, setIsPickerOpen] = useState(false)
	const [userToSearch, setUserToSearch] = useState('')
	const elSearchInput = useRef()

	useEffect(() => {
		document.addEventListener('mousedown', onClosePicker)
		return () => {
			document.removeEventListener('mousedown', onClosePicker)
		}
	}, [])

	function onClosePicker(ev) {
		if (!ev.target.closest('.member-picker-modal')) setIsPickerOpen(false)
	}

	function handleSearch({ target }) {
		setUserToSearch(target.value)
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
				<>
					<div className="modal-up-arrow"></div>
					<div className="member-picker-modal">
						<div className="input-container " onClick={() => elSearchInput.current.focus()}>
							<input
								type="text"
								placeholder="Search names"
								ref={elSearchInput}
								value={userToSearch}
								onChange={handleSearch}
							/>
							<span className={`svg-container ${userToSearch ? 'active-search' : ''}`}>
								{userToSearch ? ICON_CLOSE : ICON_SEARCH}
							</span>
						</div>
						<ul className="members-list clean-list">
							<span>Suggested people</span>
							<li>Member1</li>
							<li>Member2</li>
							<li>Member3</li>
						</ul>
					</div>
				</>
			)}
		</li>
	)
}
