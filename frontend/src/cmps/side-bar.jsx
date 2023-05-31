import {
    ICON_NOTIFICATIONS, ICON_INBOX, ICON_WORK_MANAGEMENT, ICON_MY_WORK,
    ICON_FAVORITES, ICON_INVITE_MEMBERS, ICON_SEARCH, ICON_HELP, ICON_MENU
} from "../assets/icons/icons";

export function SideBar() {




    return (
        <ul className="clean-list">
            {/* <li><img src="https://cdn.monday.com/images/logos/monday_logo_icon.png" alt="" /></li> */}
            <li>{ICON_WORK_MANAGEMENT}</li>
            <li>{ICON_NOTIFICATIONS}</li>
            <li>{ICON_INBOX}</li>
            <li>{ICON_MY_WORK}</li>
            <li>{ICON_FAVORITES}</li>
            <li>{ICON_INVITE_MEMBERS}</li>
            <li>{ICON_SEARCH}</li>
            <li>{ICON_HELP}</li>
            <li>{ICON_MENU}</li>
        </ul>
    )
}
