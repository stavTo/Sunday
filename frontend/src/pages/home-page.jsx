import { useEffect, useState } from 'react'

import marketingIcon from '../assets/img/marketing_icon.png'
import designIcon from '../assets/img/design_icon.png'
import devIcon from '../assets/img/dev_icon.png'
import crmIcon from '../assets/img/crm_icon.png'
import hrIcon from '../assets/img/hr_icon.png'
import operationIcon from '../assets/img/operations_icon.png'
import pmoIcon from '../assets/img/pmo_icon.png'
import taskIcon from '../assets/img/task_icon.png'
import workflowsIcon from '../assets/img/workflows_icon.png'
import HP_asset_white_bg from '../assets/img/HP_asset_white_bg.avif'

import bdSponser from '../assets/img/img-sponser/bd.png'
import canvaSponser from '../assets/img/img-sponser/canva.png'
import cocaColaSponser from '../assets/img/img-sponser/coca_cola.png'
import glossierSponser from '../assets/img/img-sponser/glossier.png'
import holtCatSponser from '../assets/img/img-sponser/HoltCat.avif'
import huluSponser from '../assets/img/img-sponser/hulu.png'
import lionsgateSponser from '../assets/img/img-sponser/lionsgate.avif'
import oxySponser from '../assets/img/img-sponser/oxy.png'
import universalSponser from '../assets/img/img-sponser/universal.png'

import { BTN_ARROW } from '../assets/icons/icons'
import { loadBoards } from '../store/board.actions'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import logo from '../assets/img/logo.png'
import { showErrorMsg } from '../services/event-bus.service'

export function HomePage() {
	const navigate = useNavigate()
	const boards = useSelector(({ boardModule }) => boardModule.boards)
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		onLoadBoards()
	}, [])

	async function onLoadBoards() {
		try {
			await loadBoards()
		} catch {
			showErrorMsg('Something went wrong')
		}
	}

	window.onscroll = function handleScroll() {
		const isScrolled = window.scrollY > 0
		setScrolled(isScrolled)
	}

	function onNavigate() {
		if (boards[0]) navigate(`/boards/${boards[0]._id}`)
		else navigate(`/boards/${boards._id}`)
	}

	return (
		<section className="home-page main-layout scrolled">
			<header className={`home-header main-layout full ${`${scrolled ? 'scrolled' : ''}`}`}>
				<nav className="main-nav flex">
					<div className="logo">
						<img src={logo} />
					</div>
					<ul className="clean-list flex">
						<li>
							<a href="">About</a>
						</li>
						<li>
							<a href="">Log in</a>
						</li>
						<li>
							<button className="btn-get-started btn-arrow" onClick={onNavigate}>
								<span className="btn-title">Get Started</span>
								<span className="btn-arrow">{BTN_ARROW}</span>
							</button>
						</li>
					</ul>
				</nav>
			</header>
			<main className="home-main">
				<div className="titles-container">
					<span className="main-title">A platform built for a new way of working</span>
					<span className="secondary-title">What would you like to manage with sunday.com Work OS?</span>
				</div>
				<section className="card-container full">
					<div className="cards-section flex justify-center">
						<div className="card">
							<div className="icon-container">
								<img src={designIcon} alt="" />
							</div>
							<span>Creative & design</span>
						</div>
						<div className="card">
							<div className="icon-container">
								<img src={devIcon} alt="" />
							</div>
							<span>Software development</span>
						</div>
						<div className="card">
							<div className="icon-container">
								<img src={marketingIcon} alt="" />
							</div>
							<span>Marketing</span>
						</div>
						<div className="card">
							<div className="icon-container">
								<img src={pmoIcon} alt="" />
							</div>
							<span>Project management</span>
						</div>
						<div className="card">
							<div className="icon-container">
								<img src={crmIcon} alt="" />
							</div>
							<span>Sales & CRM</span>
						</div>
						<div className="card">
							<div className="icon-container">
								<img src={taskIcon} alt="" />
							</div>
							<span>Task management</span>
						</div>
						<div className="card">
							<div className="icon-container">
								<img src={hrIcon} alt="" />
							</div>
							<span>HR</span>
						</div>
						<div className="card">
							<div className="icon-container">
								<img src={operationIcon} alt="" />
							</div>
							<span>Operations</span>
						</div>
						<div className="card">
							<div className="icon-container">
								<img src={workflowsIcon} alt="" />
							</div>
							<span>More workflows</span>
						</div>
					</div>
				</section>
				<section className="btn-container">
					<button className="btn-get-started btn-arrow" onClick={onNavigate}>
						<span className="btn-title">Get Started</span>
						<span className="btn-arrow">{BTN_ARROW}</span>
					</button>
					<span>No credit card needed ✦ Unlimited time on Free plan</span>
				</section>
			</main>

			<section className="img-container">
				<img src={HP_asset_white_bg} alt="" />
			</section>
			<section className="sponsers">
				<h2>Trusted by 180,000+ customers worldwide</h2>
				<ul className="sponsers-list clean-list">
					<li>
						<img src={bdSponser} alt="" />
					</li>
					<li>
						<img src={canvaSponser} alt="" />
					</li>
					<li>
						<img src={cocaColaSponser} alt="" />
					</li>
					<li>
						<img src={glossierSponser} alt="" />
					</li>
					<li>
						<img src={holtCatSponser} alt="" />
					</li>
					<li>
						<img src={huluSponser} alt="" />
					</li>
					<li>
						<img src={lionsgateSponser} alt="" />
					</li>
					<li>
						<img src={oxySponser} alt="" />
					</li>
					<li>
						<img src={universalSponser} alt="" />
					</li>
				</ul>
			</section>
		</section>
	)
}
