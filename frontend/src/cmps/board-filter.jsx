import { FILTER_PERSON, FILTER_FILTER, FILTER_SORT, FILTER_HIDE, ICON_MENU_DOTS } from '../assets/icons/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

export function BoardFilter() {
	return (
		<section className="board-filter">
			<div className="search-container btn-primary">
				<span className="filter-icon">
					<FontAwesomeIcon icon={faMagnifyingGlass} />
				</span>
				<input type="text" placeholder="Search" />
			</div>
			<div className="person-container btn-primary">
				<span className="filter-icon">{FILTER_PERSON}</span>
				<span className="filter-text">Person</span>
			</div>
			<div className="filter-container btn-primary">
				<span className="filter-icon">{FILTER_FILTER}</span>
				<span className="filter-text">Filter</span>
			</div>
			<div className="sort-container btn-primary">
				<span className="filter-icon">{FILTER_SORT}</span>
				<span className="filter-text">Sort</span>
			</div>
			<div className="hide-container btn-primary">
				<span className="filter-icon">{FILTER_HIDE}</span>
				<span className="filter-text">Hide</span>
			</div>
			<div className="menu-container btn-primary">
				<span className="filter-icon">{ICON_MENU_DOTS}</span>
			</div>
		</section>
	)
}
