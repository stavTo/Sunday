import { BoardPreview } from '../index-cmps/board-preview.jsx'
import { ICON_EXPAND_ARROW } from '../../assets/icons/icons.js'
import { useState } from 'react'

export function BoardList({ boards }) {
	const [toggleView, setToggleView] = useState(true)

	return (
		<div className="list-wrapper">
			<h1 className="fs18 flex row gap-half text-cursor">
				<div
					className={`${toggleView ? 'expand-arrow-container pointer' : 'close-arrow-container pointer'}`}
					onClick={() => setToggleView(!toggleView)}
				>
					{ICON_EXPAND_ARROW}
				</div>
				Recently visited
			</h1>
			{toggleView && (
				<ul className="index-board-list clean-list">
					{boards &&
						boards.map(board => {
							return (
								<li key={board._id}>
									<BoardPreview board={board} />
								</li>
							)
						})}
				</ul>
			)}
		</div>
	)
}
