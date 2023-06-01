
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




export function HomePage() {

	return <section className="home-page main-layout">

		<header className="home-header main-layout full">
			<nav className="main-nav flex">
				<div className="logo">
					logo!
				</div>
				<ul className="clean-list flex">
					<li> <a href="">About</a> </li>
					<li><a href="">Log in</a> </li>
					<li><button className='btn-get-started btn-arrow'>
						<span className='btn-title'>Get Started</span>
						<span className='btn-arrow'>{BTN_ARROW}</span>
					</button></li>
				</ul>
			</nav>
		</header>

		<main className='home-main'>
			<div className="titles-container">
				<span className='main-title'>
					A platform built for a
					new way of working
				</span>
				<span className='secondary-title'>
					What would you like to manage with sunday.com Work OS?
				</span>
			</div>

			<section className="card-container">
				<div className="card">
					<img src={designIcon} alt="" />
					<span>Creative & design</span>
				</div>
				<div className="card">
					<img src={devIcon} alt="" />
					<span>Software development</span>
				</div>
				<div className="card">
					<img src={marketingIcon} alt="" />
					<span>Marketing</span>
				</div>
				<div className="card">
					<img src={pmoIcon} alt="" />
					<span>Project management</span>
				</div>
				<div className="card">
					<img src={crmIcon} alt="" />
					<span>Sales & CRM</span>
				</div>
				<div className="card">
					<img src={taskIcon} alt="" />
					<span>Task management</span>
				</div>
				<div className="card">
					<img src={hrIcon} alt="" />
					<span>HR</span>
				</div>
				<div className="card">
					<img src={operationIcon} alt="" />
					<span>Operations</span>
				</div>
				<div className="card">
					<img src={workflowsIcon} alt="" />
					<span>More workflows</span>
				</div>
			</section>

			<section className='btn-container'>
				<button className='btn-get-started btn-arrow'>
					<span className='btn-title'>Get Started</span>
					<span className='btn-arrow'>{BTN_ARROW}</span>
				</button>
				<span>No credit card needed   ✦   Unlimited time on Free plan</span>
			</section>
		</main>

		<section className="img-container">
			<img src={HP_asset_white_bg} alt="" />
		</section>


		<section className='sponsers'>

			<h2>Trusted by 180,000+ customers worldwide</h2>

			<ul className='sponsers-list clean-list'>
				<li><img src={bdSponser} alt="" /></li>
				<li><img src={canvaSponser} alt="" /></li>
				<li><img src={cocaColaSponser} alt="" /></li>
				<li><img src={glossierSponser} alt="" /></li>
				<li><img src={holtCatSponser} alt="" /></li>
				<li><img src={huluSponser} alt="" /></li>
				<li><img src={lionsgateSponser} alt="" /></li>
				<li><img src={oxySponser} alt="" /></li>
				<li><img src={universalSponser} alt="" /></li>
			</ul>

		</section>



	</section>
}
