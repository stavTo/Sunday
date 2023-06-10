import { WorkspaceBoardList } from './workspace-board-list'
import { ICON_EXPAND_ARROW } from '../assets/icons/icons'
import { FavoritesList } from './favorites-list'

export function ExpandableSidebar({
	isFavoritesOpen,
	isFixed,
	setIsFixed,
	debouncedSetIsHovered,
	isHovered,
	setIsFavoritesOpen,
}) {
	function onToggleExpandableSideBar() {
		setIsFavoritesOpen(false)
		setIsFixed(prev => !prev)
	}

	return (
		<section className="container">
			<div
				className={`expand-btn flex align-center justify-center pointer ${
					isFixed ? 'rotate-arrow-left' : 'rotate-arrow-right'
				}`}
				onClick={onToggleExpandableSideBar}
			>
				{ICON_EXPAND_ARROW}
			</div>
			<div
				className="workspace-container"
				onMouseEnter={() => debouncedSetIsHovered(true)}
				onMouseLeave={() => debouncedSetIsHovered(false)}
			>
				<div className={`expandable-sidebar-container ${isHovered ? 'expanded' : ''}`}>
					<section className={`${isFixed ? 'open expandable-sidebar' : 'expandable-sidebar'}`}>
						{!isFavoritesOpen ? (
							(isFixed || isHovered) && <WorkspaceBoardList fixed={isFixed} />
						) : (
							<FavoritesList />
						)}
					</section>
				</div>
			</div>
		</section>
	)
}
