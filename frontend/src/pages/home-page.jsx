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
import { useNavigate } from 'react-router'
import logo from '../assets/img/logo.png'
import { showErrorMsg } from '../services/event-bus.service'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export function HomePage() {
	const navigate = useNavigate()
	const [scrolled, setScrolled] = useState(false)
	const { boards } = useSelector(({ boardModule }) => boardModule)
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
		navigate(`/boards/${boards[0]._id}`)
	}

	return (
		<section className="home-page main-layout scrolled">
			<header className={`home-header main-layout full ${`${scrolled ? 'scrolled' : ''}`}`}>
				<nav className="main-nav flex">
					<div className="logo">
						<img src={logo} alt="logo" />
					</div>
					<ul className="clean-list flex">
						<li>
							<Link to="/auth/login">Log in</Link>
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
					<div className="cards-section">
						<div className="card">
							<div className="icon-container">
								<img src={designIcon} alt="design" />
							</div>
							<span>Creative & design</span>
						</div>
						<div className="card">
							<div className="icon-container">
								<img src={devIcon} alt="card" />
							</div>
							<span>Software development</span>
						</div>
						<div className="card">
							<div className="icon-container">
								<img src={marketingIcon} alt="card" />
							</div>
							<span>Marketing</span>
						</div>
						<div className="card">
							<div className="icon-container">
								<img src={pmoIcon} alt="card" />
							</div>
							<span>Project management</span>
						</div>
						<div className="card">
							<div className="icon-container">
								<img src={crmIcon} alt="card" />
							</div>
							<span>Sales & CRM</span>
						</div>
						<div className="card">
							<div className="icon-container">
								<img src={taskIcon} alt="card" />
							</div>
							<span>Task management</span>
						</div>
						<div className="card">
							<div className="icon-container">
								<img src={hrIcon} alt="card" />
							</div>
							<span>HR</span>
						</div>
						<div className="card">
							<div className="icon-container">
								<img src={operationIcon} alt="card" />
							</div>
							<span>Operations</span>
						</div>
						<div className="card">
							<div className="icon-container">
								<img src={workflowsIcon} alt="card" />
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
				<img src={HP_asset_white_bg} alt="hp" />
			</section>
			<section className="sponsers">
				<h2>Trusted by 180,000+ customers worldwide</h2>
				<ul className="sponsers-list clean-list">
					<li>
						<img src={bdSponser} alt="bd" />
					</li>
					<li>
						<img src={canvaSponser} alt="canva" />
					</li>
					<li>
						<img src={cocaColaSponser} alt="coca cola" />
					</li>
					<li>
						<img src={glossierSponser} alt="glossier" />
					</li>
					<li>
						<img src={holtCatSponser} alt="holt cat" />
					</li>
					<li>
						<img src={huluSponser} alt="hulu" />
					</li>
					<li>
						<img src={lionsgateSponser} alt="lionsgate" />
					</li>
					<li>
						<img src={oxySponser} alt="oxy" />
					</li>
					<li>
						<img src={universalSponser} alt="universal" />
					</li>
				</ul>
			</section>
		</section>
	)
}
