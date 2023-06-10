import { Link } from 'react-router-dom'

import { ICON_WORK_MANAGEMENT, ICON_MY_WORK, ICON_FAVORITES } from '../assets/icons/icons'

import guest from '../assets/img/guest.png'

import { ExpandableSidebar } from '../cmps/expandable-sidebar.jsx'
import { TippyContainer } from './tippy-container'
import { useState } from 'react'
import { utilService } from '../services/util.service'

export function SideBar({ isExpandable = true }) {
	const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
	const [isFixed, setIsFixed] = useState(false)
	const [isHovered, setIsHovered] = useState(false)

	const debouncedSetIsHovered = utilService.debounce(setIsHovered, 200)

	function onToggleFavorites() {
		if (isFavoritesOpen) return
		setIsFavoritesOpen(prev => !prev)
		if (isFixed) return
		setIsFixed(prev => !prev)
	}

	return (
		<>
			<section className="side-bar">
				<ul className="nav-container clean-list flex">
					<li className="top-navigation-area">
						<ul className="clean-list flex column align-center">
							<li className="flex" data-tippy-content="home page">
								<Link to="/index">
									<img src="https://cdn.monday.com/images/logos/monday_logo_icon.png" alt="" />
								</Link>
							</li>
							<hr></hr>
							<div className="flex column gap-1">
								<TippyContainer txt={'Work management'} placement="right" offset={[0, 20]}>
									<li className="flex work-management" onClick={() => setIsFavoritesOpen(false)}>
										{ICON_WORK_MANAGEMENT}
									</li>
								</TippyContainer>
								<TippyContainer txt={'My Work'} placement="right" offset={[0, 20]}>
									<li className="flex my-work">{ICON_MY_WORK}</li>
								</TippyContainer>
								<TippyContainer txt={'Favorites'} placement="right" offset={[0, 20]}>
									<li className="flex favorites" onClick={onToggleFavorites}>
										{ICON_FAVORITES}
									</li>
								</TippyContainer>
							</div>
						</ul>
					</li>
					<li className="bottom-navigation-area">
						<ul className="clean-list flex column align-center">
							<TippyContainer txt={'Profile'} placement="right" offset={[0, 20]}>
								<li className="flex profile ">
									<img src={guest} data-tippy-content="guest" />
								</li>
							</TippyContainer>
						</ul>
					</li>
				</ul>
			</section>
			{isExpandable ? (
				<ExpandableSidebar
					isFavoritesOpen={isFavoritesOpen}
					setIsFavoritesOpen={setIsFavoritesOpen}
					isHovered={isHovered}
					debouncedSetIsHovered={debouncedSetIsHovered}
					isFixed={isFixed}
					setIsFixed={setIsFixed}
				/>
			) : (
				''
			)}
		</>
	)
}
