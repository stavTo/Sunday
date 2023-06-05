import { useState } from 'react'
import { WorkspaceBoardList } from './workspace-board-list'
import { ICON_EXPAND_ARROW } from '../assets/icons/icons'
import { utilService } from '../services/util.service'

export function ExpandableSidebar() {
	const [isHovered, setIsHovered] = useState(false)
	const [isFixed, setIsFixed] = useState(false)

	const debouncedSetIsHovered = utilService.debounce(setIsHovered, 200)

	return (
		<section className='container'>
			<div
				className={`expand-btn flex align-center justify-center pointer ${isFixed ? 'rotate-arrow-left' : 'rotate-arrow-right'
					}`}
				onClick={() => setIsFixed(prev => !prev)}>
				{ICON_EXPAND_ARROW}
			</div>
			<div
				className={`${isHovered && !isFixed ? 'workspace-container shadow' : 'workspace-container'}`}
				onMouseEnter={() => debouncedSetIsHovered(true)}
				onMouseLeave={() => debouncedSetIsHovered(false)}>
				<div className={`expandable-sidebar-container ${isHovered ? 'expanded' : ''}`}>
					<section className={`${isFixed ? 'open expandable-sidebar' : 'expandable-sidebar'}`}>
						{(isFixed || isHovered) && <WorkspaceBoardList fixed={isFixed} />}
					</section>
				</div>
			</div>
		</section>
	)
}
