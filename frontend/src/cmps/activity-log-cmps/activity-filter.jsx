import { useEffect, useRef, useState } from 'react'
import { FILTER_PERSON } from '../../assets/icons/icons'
import { TippyContainer } from '../tippy-container'

export function ActivityFilter({ onSetFilter, filter }) {
	const [filterByToEdit, setFilterByToEdit] = useState(filter)
	const [inputFocused, setInputFocused] = useState(false)
	const elSearchInput = useRef('')
	const [active, setActive] = useState('')

	function onSetActive(ev, state) {
		console.log('hey:', state)
		ev.stopPropagation()
		if (state === active) return setActive('')
		setActive(state)
	}

	useEffect(() => {
		onSetFilter(filterByToEdit)
		// eslint-disable-next-line
	}, [filterByToEdit])

	function handleSearch({ target }) {
		const field = target.name
		const value = target.value
		setFilterByToEdit(prevFilterBy => ({ ...prevFilterBy, [field]: value }))
	}

	return (
		<div className="filter-activity flex align-center justify-start gap-1">
			<div className="input-container flex align-center">
				<input
					className="filter-search-input"
					ref={elSearchInput}
					type="search"
					placeholder="Filter by name"
					name="txt"
					value={filter.txt}
					onChange={handleSearch}
					onBlur={() => setInputFocused(false)}
				/>
			</div>
			<TippyContainer txt={'Filter by person'}>
				{/* <div
                    className={`member-container btn-primary ${active === 'member' && 'active'}`}
                    onClick={ev => onSetActive(ev, 'member')}
                >
                    <span className="filter-icon">{FILTER_PERSON}</span>
                    <span className="filter-text">Person</span>
                    {filter.memberId && (
                        <span
                            className="empty-filter-btn"
                            onClick={() => onSetFilter(prev => ({ ...prev, memberId: '' }))}
                        >
                            {ICON_CLOSE}
                        </span>
                    )}
                    {active === 'member' && <MemberFilter setFilter={onSetFilter} board={board}></MemberFilter>}
                </div> */}
				<div
					className="filter-person btn-primary flex align-center gap-half"
					onClick={ev => onSetActive(ev, 'member')}
				>
					{FILTER_PERSON}
					<span>Person</span>
				</div>
			</TippyContainer>
		</div>
	)
}
