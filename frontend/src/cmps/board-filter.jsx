import { FILTER_PERSON } from '../assets/icons/icons'

export function BoardFilter() {
	return (
		<section className="board-filter">
			<div className="search-container btn-primary">
				<span className="filter-icon"></span>
				<input type="text" placeholder="Search" />
			</div>
			<div className="person-container btn-primary">
				<span className="filter-icon">{FILTER_PERSON}</span>
				<span>Person</span>
			</div>
			<div className="filter-container btn-primary">
				<span className="filter-icon"></span>
				<span>Filter</span>
				<span className="extra-filter">V</span>
			</div>
			<div className="sort-container btn-primary">
				<span className="filter-icon"></span>
				<span>Sort</span>
			</div>
			<div className="hide-container btn-primary">
				<span className="filter-icon"></span>
				<span>Hide</span>
			</div>
			<button className="menu-button btn-primary">...</button>
		</section>
	)
}
