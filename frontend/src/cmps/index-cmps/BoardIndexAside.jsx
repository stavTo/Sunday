import template from '../../assets/img/board-index/templates-banner.png'
import getStarted from '../../assets/img/board-index/get-started.svg'
import helpCenter from '../../assets/img/board-index/help-center.svg'
import webinar from '../../assets/img/board-index/webinars.svg'

export function BoardIndexAside({ setToggleInputModal }) {
	return (
		<aside className="right-panel flex column gap-1">
			<div className="explore-templates flex column">
				<img src={template} alt="template" />
				<span>Boost you workflow in minutes with ready-made templates</span>
				<button
					className="btn-primary p-half-em"
					onClick={() => setToggleInputModal(toggleInputModal => !toggleInputModal)}
				>
					Explore templates
				</button>
			</div>
			<div className="learn flex column gap-1">
				<span>Learn and get inspired</span>
				<div className="cards-container fs14 flex column gap-1">
					<div className="getting-started help-card p-16 flex gap-1 pointer">
						<img src={getStarted} alt="get started" />
						<div className="description flex column space-evenly">
							<div className="title wght-700">Getting started</div>
							<span>Learn how sunday.com works</span>
						</div>
					</div>
					<div className="help-center help-card p-16 flex gap-1 pointer">
						<img src={helpCenter} alt="help center" />
						<div className="description flex column space-evenly">
							<div className="title wght-700">Help center</div>
							<span>Learn and get support</span>
						</div>
					</div>
					<div className="join-webinar help-card p-16 flex gap-1 pointer ">
						<img src={webinar} alt="webinar" />
						<div className="description flex column space-evenly">
							<div className="title wght-700 wght-700">Join a webinar</div>
							<span>Watch a live walkthrough</span>
						</div>
					</div>
				</div>
			</div>
		</aside>
	)
}
