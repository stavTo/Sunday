import { Link, useNavigate } from 'react-router-dom'

import { ICON_WORK_MANAGEMENT, ICON_FAVORITES } from '../assets/icons/icons'

import guest from '../assets/img/guest.png'

import { ExpandableSidebar } from '../cmps/expandable-sidebar.jsx'
import { TippyContainer } from './tippy-container'
import { useState } from 'react'
import { utilService } from '../services/util.service'
import { useSelector } from 'react-redux'

export function SideBar({ isExpandable = true }) {
	const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
	const [isFixed, setIsFixed] = useState(false)
	const [isHovered, setIsHovered] = useState(false)
	const navigate = useNavigate()
	const user = useSelector(storeState => storeState.userModule.user)

	const debouncedSetIsHovered = utilService.debounce(setIsHovered, 200)

	function onToggleFavorites() {
		if (isFavoritesOpen) return
		setIsFavoritesOpen(prev => !prev)
		if (isFixed) return
		setIsFixed(prev => !prev)
	}

	function onOpenUserProfile() {
		if (!user?._id) navigate('/auth/login')
		else navigate(`/users/${user._id}/personal_info`)
	}

	return (
		<>
			<section className="side-bar">
				<ul className="nav-container clean-list flex">
					<li className="top-navigation-area">
						<ul className="clean-list flex column align-center">
							<li className="flex" data-tippy-content="home page">
								<Link to="/boards">
									<img src="https://cdn.monday.com/images/logos/monday_logo_icon.png" alt="logo" />
								</Link>
							</li>
							<hr></hr>
							<div className="flex column gap-1">
								<TippyContainer txt={'Work management'} placement="right" offset={[0, 20]}>
									<li className={`flex work-management`} onClick={() => setIsFavoritesOpen(false)}>
										{ICON_WORK_MANAGEMENT}
										{(!isFavoritesOpen && isFixed) && <div className="active"></div>}
									</li>
								</TippyContainer>
								<TippyContainer txt={'Favorites'} placement="right" offset={[0, 20]}>
									<li className={`flex favorites`} onClick={onToggleFavorites}>
										{ICON_FAVORITES}
										{(isFavoritesOpen && isFixed) && <div className="active"></div>}
									</li>
								</TippyContainer>
							</div>
						</ul>
					</li>
					<li className="bottom-navigation-area">
						<ul className="clean-list flex column align-center">
							<TippyContainer txt={'Profile'} placement="right" offset={[0, 20]}>
								<li className="flex profile" onClick={onOpenUserProfile}>
									<img src={user?.imgUrl || guest} alt="profile" />
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
