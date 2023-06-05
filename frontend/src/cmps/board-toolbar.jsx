import { useState } from 'react'
import { ICON_HOUSE } from '../assets/icons/icons'

export function BoardToolbar() {
	const [activeTab, setActiveTab] = useState('main')

	return (
		<ul className="clean-list flex board-nav-bar board-toolbar">
			<li onClick={() => setActiveTab('main')} className={`${activeTab === 'main' ? 'active' : ''}`}>
				<div className="btn-primary">
					<span href="#">{ICON_HOUSE} Main Table</span>
				</div>
			</li>
			<li onClick={() => setActiveTab('kanban')} className={`${activeTab === 'kanban' ? 'active' : ''}`}>
				<div className="btn-primary">
					<span href="#">Kanban</span>
				</div>
			</li>
		</ul>
	)
}
