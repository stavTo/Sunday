import { Link } from 'react-router-dom'

import {
	ICON_INBOX,
	ICON_WORK_MANAGEMENT,
	ICON_MY_WORK,
	ICON_FAVORITES,
	ICON_INVITE_MEMBERS,
} from '../assets/icons/icons'

import guest from '../assets/img/guest.png'

import { ExpandableSidebar } from '../cmps/expandable-sidebar.jsx'
import { TippyContainer } from './tippy-container'

export function SideBar({ isExpandable = true }) {
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
									<li className="flex work-management">{ICON_WORK_MANAGEMENT}</li>
								</TippyContainer>
								<TippyContainer txt={'My Work'} placement="right" offset={[0, 20]}>
									<li className="flex my-work">{ICON_MY_WORK}</li>
								</TippyContainer>
								<TippyContainer txt={'Favorites'} placement="right" offset={[0, 20]}>
									<li className="flex favorites">{ICON_FAVORITES}</li>
								</TippyContainer>
							</div>
						</ul>
					</li>
					{/* Section 1 ends here */}
					<li className="bottom-navigation-area">
						<ul className="clean-list flex column align-center">
							<TippyContainer txt={'Invite Members'} placement="right" offset={[0, 20]}>
								<li className="flex invite-members">{ICON_INVITE_MEMBERS}</li>
							</TippyContainer>
							<TippyContainer txt={'Profile'} placement="right" offset={[0, 20]}>
								<li className="flex profile ">
									<img src={guest} data-tippy-content="guest" />
								</li>
							</TippyContainer>
						</ul>
					</li>
				</ul>
			</section>
			{isExpandable ? <ExpandableSidebar /> : ''}
		</>
	)
}
