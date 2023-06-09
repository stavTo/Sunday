import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { FILTER_PERSON, ICON_CLOSE } from "../../assets/icons/icons"
import { TippyContainer } from '../tippy-container'
import { boardService } from '../../services/board.service'
import { utilService } from "../../services/util.service"
import { MemberFilter } from '../../cmps/board-filter-cmps/member-filter'

export function ActivityFilter({ onSetFilter, filter }) {
    const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)
    const [filterByToEdit, setFilterByToEdit] = useState(filter)
    const [inputFocused, setInputFocused] = useState(false)
    const elSearchInput = useRef('')
    const [active, setActive] = useState('')

    function onSetActive(ev, state) {
        console.log("hey:", state)
        ev.stopPropagation()
        if (state === active) return setActive('')
        setActive(state)
    }

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    // async function onLoadActivities() {
    //     try {
    //         boardService.loadActivities(board, filter)
    //         debouncedLoadBoard.current(board._id, filter)
    //     } catch {
    //         console.log('cant load board')
    //     }
    // }

    function handleSearch({ target }) {
        const field = target.name
        const value = target.value
        // console.log("filterByToEdit:", filterByToEdit)
        setFilterByToEdit(prevFilterBy => ({ ...prevFilterBy, [field]: value }))
    }

    return (
        <div className="filter-activity flex align-center justify-start gap-1">
            <div className="input-container flex align-center">
                {/* <input type="search" placeholder="Filter by name"></input> */}
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
                <div className="filter-person btn-primary flex align-center gap-half"
                    onClick={ev => onSetActive(ev, 'member')}>
                    {FILTER_PERSON}
                    <span>Person</span>
                </div>
            </TippyContainer>
        </div>
    )
}