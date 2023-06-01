
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

export function HomePage() {



	return <section className="home-page main-layout">

		<header className="home-header main-layout full">
			<nav className="main-nav flex">
				<div className="logo">
					logo!
				</div>
				<ul className="clean-list flex">
					<li>About</li>
					<li>Log in</li>
					<li><button className='btn-get-started'>Get Started</button></li>
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
				<button className='btn-get-started'>Get Started</button>
				<span>No credit card needed   ✦   Unlimited time on Free plan</span>
			</section>


			<div className="img-container full">
				<img src={HP_asset_white_bg} alt="" />
			</div>
		</main>






	</section>
}
