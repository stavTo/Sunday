import { ICON_EXPAND_ARROW } from '../../assets/icons/icons'
import emptyInbox from '../../assets/img/board-index/empty-inbox.svg'

import { useState } from 'react'

export function IndexInbox() {
	const [toggle, setToggle] = useState(false)

	return (
		<section className="inbox p-1em">
			<h1 className="fs18 flex row gap-half text-cursor align-center">
				<div
					className={`${toggle ? 'expand-arrow-container pointer' : 'close-arrow-container pointer'}`}
					onClick={() => setToggle(!toggle)}
				>
					{ICON_EXPAND_ARROW}
				</div>
				Inbox <span className="inbox-indication flex align-center justify-center wght-400">0</span>
			</h1>
			{toggle && (
				<div className="inbox-container flex column">
					<img className="empty-inbox flex justify-center" src={emptyInbox} alt="empty inbox" />
					<div className="flex column fs-15 align-center space-between mbe-1">
						<span>High Five!</span>
						<span>Your inbox is empty, We'll let you know when we get news</span>
					</div>
				</div>
			)}
		</section>
	)
}
