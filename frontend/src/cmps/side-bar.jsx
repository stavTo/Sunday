import {
	ICON_NOTIFICATIONS,
	ICON_INBOX,
	ICON_WORK_MANAGEMENT,
	ICON_MY_WORK,
	ICON_FAVORITES,
	ICON_INVITE_MEMBERS,
	ICON_SEARCH,
	ICON_HELP,
	ICON_MENU,
} from '../assets/icons/icons'

import { ExpandableSidebar } from '../cmps/expandable-sidebar.jsx'
import { setTippy } from '../services/tippy.service'

export function SideBar() {
	setTippy('.work-management', 'work management', 'right', [0, 20])
	setTippy('.notifications', 'notifications', 'right', [0, 20])
	setTippy('.inbox', 'inbox', 'right', [0, 20])
	setTippy('.my-work', 'my work', 'right', [0, 20])
	setTippy('.favorites', 'favorites', 'right', [0, 20])
	setTippy('.invite-members', 'invite members', 'right', [0, 20])
	setTippy('.search-everything', 'search everything', 'right', [0, 20])
	setTippy('.help', 'help', 'right', [0, 20])
	setTippy('.apps', 'apps', 'right', [0, 20])
	setTippy('.profile', 'profile', 'right', [0, 20])
	return (
		<>
			<section className="side-bar">
				<ul className="nav-container clean-list flex">
					<li className="top-navigation-area">
						<ul className="clean-list flex column align-center">
							<li className="flex" data-tippy-content="home page">
								<img src="https://cdn.monday.com/images/logos/monday_logo_icon.png" alt="" />
							</li>
							{/* <hr></hr> */}
							<li className="flex work-management">{ICON_WORK_MANAGEMENT}</li>
							<li className="flex notifications">{ICON_NOTIFICATIONS}</li>
							<li className="flex inbox">{ICON_INBOX}</li>
							<li className="flex my-work">{ICON_MY_WORK}</li>
							<li className="flex favorites">{ICON_FAVORITES}</li>
						</ul>
					</li>
					{/* Section 1 ends here */}
					<li className="bottom-navigation-area">
						<ul className="clean-list flex column align-center">
							<li className="flex invite-members">{ICON_INVITE_MEMBERS}</li>
							<li className="flex search-everything">{ICON_SEARCH}</li>
							<li className="flex help">{ICON_HELP}</li>
							<hr></hr>
							<li className="flex apps">{ICON_MENU}</li>
							<li className="flex profile ">
								<img src="https://yomrishon.onrender.com/imgs/user.png" data-tippy-content="guest" />
							</li>
						</ul>
					</li>
				</ul>
			</section>
			<ExpandableSidebar />
		</>
	)
}
