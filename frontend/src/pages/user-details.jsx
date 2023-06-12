import { useSelector } from 'react-redux'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { AiFillSkype } from 'react-icons/ai'
import { FaPhone } from 'react-icons/fa'
import { TfiEmail } from 'react-icons/tfi'
import { BsPersonFill } from 'react-icons/bs'
import { SlLocationPin } from 'react-icons/sl'
import { useState } from 'react'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { userService } from '../services/user.service'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { ICON_CLOSE } from '../assets/icons/icons'
import { logout, updateUser } from '../store/user.actions'
import { ImgUploader } from '../cmps/img-uploader'
import { GrLogout } from 'react-icons/gr'

export function UserDetails() {
	const navigate = useNavigate()
	const user = useSelector(storeState => storeState.userModule.user)

	async function onChangeImg(imgUrl) {
		try {
			const userToSave = { ...user, imgUrl }
			updateUser(userToSave)
			showSuccessMsg('Image profile has changed')
		} catch (err) {
			showErrorMsg('Something went wrong')
		}
	}

	function onLogout() {
		try {
			logout()
			showSuccessMsg('Logged out!')
			navigate('/')
		} catch {
			showErrorMsg("Whoops! Can't log out!")
		}
	}

	if (!user) return <h1>Please login</h1>
	return (
		<section className="user-details">
			<RiArrowGoBackFill className="back-icon" onClick={() => navigate('/boards')} />
			<div className="logout-icon" onClick={onLogout}>
				<GrLogout />
				<span>Logout</span>
			</div>
			<header className="main-header">
				<div className="img-container">
					<img src={user.imgUrl} alt="user" />
					<div className="change-img-profile">
						<span>
							<BsPersonFill />
						</span>
						<span>Change profile picture</span>
					</div>
					<ImgUploader onChangeImg={onChangeImg} />
				</div>
				<h1>{user.fullname}</h1>

				<nav className="main-nav">
					<ul className="clean-list flex">
						<li>
							<NavLink to="personal_info">Personal info</NavLink>
						</li>
						<li>
							<NavLink to="password">Password</NavLink>
						</li>
					</ul>
				</nav>
			</header>
			<Outlet />
		</section>
	)
}

export function PersonalInfo() {
	const [currModalOpen, setCurrModalOpen] = useState('')
	const [modalData, setModalData] = useState(userService.getDefaultModalData())
	const user = useSelector(storeState => storeState.userModule.user)

	function handleChange({ target }) {
		const field = target.name
		const value = target.value
		setModalData(prev => ({ ...prev, [field]: value }))
	}

	async function onChangeData() {
		const userToSave = { ...user, ...modalData }
		updateUser(userToSave)
		setCurrModalOpen('')
	}

	if (!user)
		return (
			<div>
				<h1>Please Log in</h1>
			</div>
		)
	return (
		<section className="personal-info">
			<h2>Overview</h2>
			<ul className="clean-list">
				<li>
					<div className="icon-container ">
						<BsPersonFill className="bigger" />
					</div>
					<div className="data-container" onClick={() => setCurrModalOpen('title')}>
						<span>Title:</span>
						<span className={user.title ? 'exists' : ''}>{user?.title || 'Add a title'}</span>
					</div>
				</li>
				<li>
					<div className="icon-container">
						<TfiEmail />
					</div>
					<div className="data-container" onClick={() => setCurrModalOpen('email')}>
						<span>Email:</span>
						<span className={user.email ? 'exists' : ''}>{user?.email}</span>
					</div>
				</li>
				<li>
					<div className="icon-container" style={{ rotate: '90deg' }}>
						<FaPhone />
					</div>
					<div className="data-container" onClick={() => setCurrModalOpen('phone')}>
						<span>Phone:</span>
						<span className={user.phone ? 'exists' : ''}>{user?.phone || 'Add a phone number'}</span>
					</div>
				</li>
				<li>
					<div className="icon-container">
						<AiFillSkype className="bigger" />
					</div>
					<div className="data-container" onClick={() => setCurrModalOpen('skype')}>
						<span>Skype:</span>
						<span className={user.skype ? 'exists' : ''}>{user?.skype || 'Add a Skype number'}</span>
					</div>
				</li>
				<li>
					<div className="icon-container">
						<SlLocationPin />
					</div>
					<div className="data-container" onClick={() => setCurrModalOpen('location')}>
						<span>Location:</span>
						<span className={user.location ? 'exists' : ''}>{user?.location || 'Add a location'}</span>
					</div>
				</li>
			</ul>

			{currModalOpen && (
				<div className="modal">
					<span className="icon-close" onClick={() => setCurrModalOpen('')}>
						{ICON_CLOSE}
					</span>
					<form className="modal-form">
						<DynamicModal
							modalData={modalData}
							user={user}
							type={currModalOpen}
							handleChange={handleChange}
						/>
						<div className="btn-container">
							<button onClick={onChangeData}>Save</button>
						</div>
					</form>
				</div>
			)}
		</section>
	)
}

export function ChangePassword() {
	const user = useSelector(storeState => storeState.userModule.user)
	const [credentials, setCredentials] = useState({ currPass: '', newPass: '', confirmPass: '' })
	const navigate = useNavigate()
	const { currPass, newPass, confirmPass } = credentials

	function handleChange({ target }) {
		const field = target.name
		const value = target.value
		setCredentials(prev => ({ ...prev, [field]: value }))
	}

	async function onChangePassword(ev) {
		try {
			ev.preventDefault()
			if (newPass !== confirmPass) return showErrorMsg('Password need to be identical')
			if (newPass === currPass) return showErrorMsg('Password need to be different ')
			await userService.changePassword({ currPass, newPass, userId: user._id })
			showSuccessMsg('Password changed successfully')
			navigate('/boards')
		} catch {
			showErrorMsg('Wrong password')
		}
	}

	return (
		<section className="change-password">
			<div className="form-container">
				<h1>Change your password</h1>
				<form className="password-form" onSubmit={onChangePassword}>
					<label className="curr-pass">
						Current password
						<input type="password" value={currPass} name="currPass" onChange={handleChange} />
					</label>
					<label className="new-pass">
						New password
						<input type="password" value={newPass} name="newPass" onChange={handleChange} />
					</label>
					<label className="confirm-pass">
						Confirm new password
						<input type="password" value={confirmPass} name="confirmPass" onChange={handleChange} />
					</label>
					<div className="separator"></div>
					<button>Save</button>
				</form>
			</div>
		</section>
	)
}

function DynamicModal({ type, user, handleChange, modalData }) {
	switch (type) {
		case 'title':
			return (
				<label>
					<span>Title</span>
					<input type="text" onChange={handleChange} name="title" value={modalData.title} />
				</label>
			)
		case 'email':
			return (
				<div>
					<h1>Email</h1>
					<div>
						<span>Current email</span>
						<span>{user?.email}</span>
					</div>
					<label>
						<input type="text" onChange={handleChange} name="email" value={modalData.email} />
					</label>
					<label>
						<input type="password" onChange={handleChange} name="password" value={modalData.password} />
					</label>
				</div>
			)
		case 'phone':
			return (
				<label>
					<span>Phone</span>
					<input type="text" onChange={handleChange} name="phone" value={modalData.phone} />
				</label>
			)
		case 'skype':
			return (
				<label>
					<span>Skype</span>
					<input type="text" onChange={handleChange} name="skype" value={modalData.skype} />
				</label>
			)
		case 'location':
			return (
				<label>
					<span>Location</span>
					<input type="text" onChange={handleChange} name="location" value={modalData.location} />
				</label>
			)
		default:
			return
	}
}
