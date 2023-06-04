import { FILTER_PERSON, FILTER_FILTER, FILTER_SORT, FILTER_HIDE } from '../assets/icons/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react'
import { boardService } from '../services/board.service.local'
import { useEffectUpdate } from '../customHooks/useEffectUpdate'
import { loadBoard } from '../store/selected-board.actions'
import { TippyContainer } from './tippy-container'

export function BoardFilter({ board }) {
	const [filter, setFilter] = useState(boardService.getDefaultFilter())
	const [inputFocused, setInputFocused] = useState(false)
	const [active, setActive] = useState('')
	const elSearchInput = useRef('')

	useEffect(() => {
		document.addEventListener('click', unsetActive)
		return () => {
			document.removeEventListener('click', unsetActive)
		}
	}, [])

	useEffectUpdate(() => {
		loadBoard(board._id, filter)
	}, [filter])

	function handleSearch({ target }) {
		setFilter(prev => ({ ...prev, txt: target.value }))
	}

	function onSetInputFocus(isFocus) {
		setInputFocused(isFocus)
		isFocus ? elSearchInput.current.focus() : elSearchInput.current.blur()
	}

	function unsetActive() {
		setActive('')
	}

	function onSetActive(ev, state) {
		ev.stopPropagation()
		if (state === active) return setActive('')
		setActive(state)
	}

	const inputFocusedClass = inputFocused ? 'focused' : ''
	return (
		<section className="board-filter">
			<div className={`search-container btn-primary ${inputFocusedClass}`} onClick={() => onSetInputFocus(true)}>
				<span className="filter-icon">
					<FontAwesomeIcon icon={faMagnifyingGlass} />
				</span>
				<input
					className="filter-search-input"
					ref={elSearchInput}
					type="text"
					placeholder="Search"
					value={filter.txt}
					onChange={handleSearch}
					onBlur={() => setInputFocused(false)}
				/>
			</div>
			<TippyContainer txt={'Filter by person'} offset={[0, 15]}>
				<div
					className={`person-container btn-primary ${active === 'person' && 'active'}`}
					onClick={ev => onSetActive(ev, 'person')}
				>
					<span className="filter-icon">{FILTER_PERSON}</span>
					<span className="filter-text">Person</span>
				</div>
			</TippyContainer>
			<TippyContainer txt={'Filter by anything'} offset={[0, 15]}>
				<div
					className={`filter-container btn-primary ${active === 'filter' && 'active'}`}
					onClick={ev => onSetActive(ev, 'filter')}
				>
					<span className="filter-icon">{FILTER_FILTER}</span>
					<span className="filter-text">Filter</span>
				</div>
			</TippyContainer>
			<TippyContainer txt={'Sort by any  column'} offset={[0, 15]}>
				<div
					className={`sort-container btn-primary ${active === 'sort' && 'active'}`}
					onClick={ev => onSetActive(ev, 'sort')}
				>
					<span className="filter-icon">{FILTER_SORT}</span>
					<span className="filter-text">Sort</span>
				</div>
			</TippyContainer>
			<TippyContainer txt={'Hidden columns'} offset={[0, 15]}>
				<div
					className={`hide-container btn-primary ${active === 'hide' && 'active'}`}
					onClick={ev => onSetActive(ev, 'hide')}
				>
					<span className="filter-icon">{FILTER_HIDE}</span>
					<span className="filter-text">Hide</span>
				</div>
			</TippyContainer>
		</section>
	)
}
