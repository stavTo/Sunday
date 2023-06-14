import { getBlessingByTime } from '../../services/util.service'
import headerBackground from '../../assets/img/board-index/header-background.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt } from '@fortawesome/free-solid-svg-icons'
import { TippyContainer } from '../tippy-container'
import aiBot from '../../assets/img/ai_render.png'

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
            <div className="right-section">
                <div className="ai-bot"><img src={aiBot} /></div>
                <div className="flex row gap-1">
                    <div className="btn-wrapper">
                        <div className="ai-btn btn-primary p-half-em" onClick={() => setToggleInputModal(toggleInputModal => !toggleInputModal)}>
                            <FontAwesomeIcon icon={faBolt} style={{ color: "#ffffff" }} />
                            Generate AI templates
                        </div>
                        <div className="glow"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}
