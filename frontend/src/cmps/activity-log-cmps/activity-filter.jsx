import { useEffect, useRef, useState } from 'react'

export function ActivityFilter({ onSetFilter, filter }) {
	const [filterByToEdit, setFilterByToEdit] = useState(filter)
	const elSearchInput = useRef('')

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
				/>
			</div>
		</div>
	)
}
