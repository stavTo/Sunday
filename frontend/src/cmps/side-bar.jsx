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

import { ExpandableSidebar } from "../cmps/expandable-sidebar.jsx"

export function SideBar() {
	return (
		<>
			<section className="side-bar">
				<ul className="clean-list nav-container flex">
					<li className="top-navigation-area">
						<ul className="clean-list flex column align-center">
							<li className="flex" data-title="home page"><img src="https://cdn.monday.com/images/logos/monday_logo_icon.png" alt="" /></li>
							{/* <hr></hr> */}
							<li className="flex" data-title="work management">{ICON_WORK_MANAGEMENT}</li>
							<li className="flex" data-title="notifications">{ICON_NOTIFICATIONS}</li>
							<li className="flex" data-title="inbox">{ICON_INBOX}</li>
							<li className="flex" data-title="my work">{ICON_MY_WORK}</li>
							<li className="flex" data-title="favorites">{ICON_FAVORITES}</li>
						</ul>
					</li>
					{/* Section 1 ends here */}
					<li className="bottom-navigation-area">
						<ul className="clean-list flex column align-center">
							<li className="flex" data-title="invite members">{ICON_INVITE_MEMBERS}</li>
							<li className="flex" data-title="search everything">{ICON_SEARCH}</li>
							<li className="flex" data-title="help">{ICON_HELP}</li>
							<hr></hr>
							<li className="flex" data-title="apps">{ICON_MENU}</li>
							<li className="flex" data-title="profile">
								<img src="https://yomrishon.onrender.com/imgs/user.png" data-title="guest" />
							</li>
						</ul>
					</li>
				</ul>
			</section>
			<ExpandableSidebar />
		</>
	)
}