import { getBlessingByTime } from '../services/util.service'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt } from '@fortawesome/free-solid-svg-icons'

export function BoardIndexHeader() {
    return (
        <section className="header flex row align-center space-between">
            <div className="titles-container">
                <div className="welcome-message">{getBlessingByTime()}, Guest!</div>
                <div className="header-title">Quickly access your recent boards, Inbox and workspaces</div>
            </div>
            <img src="https://cdn.monday.com/images/homepage-desktop/header-background-v2.svg" />
            <button type="submit" className="quick-search-button btn-primary flex space-evenly align-center">
                <i className="icon icon-v2-bolt-switch"></i>
                <FontAwesomeIcon icon={faBolt} style={{ color: "#ffffff" }} />
                Quick Search
            </button>
        </section>
    )
}