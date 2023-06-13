import { getBlessingByTime } from '../../services/util.service'
import headerBackground from '../../assets/img/board-index/header-background.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt } from '@fortawesome/free-solid-svg-icons'
import { TippyContainer } from '../tippy-container'

export function BoardIndexHeader({ setToggleInputModal }) {
    return (
        <section className="header flex row align-center space-between">
            <div className="titles-container flex row">
                <div className="flex column justify-center">
                    <div className="welcome-message">{getBlessingByTime()}, Guest!</div>
                    <div className="header-title">Quickly access your recent boards, Inbox and workspaces</div>
                </div>
                <img src={headerBackground} />
            </div>
            <div className="flex row gap-1">
                <TippyContainer txt="Generate AI templates">
                    <button className="ai-btn btn-primary p-half-em" onClick={() => setToggleInputModal(toggleInputModal => !toggleInputModal)}>
                        <FontAwesomeIcon icon={faBolt} style={{ color: "#ffffff" }} />
                        Generate AI templates
                    </button>
                </TippyContainer>
            </div>
        </section>
    )
}