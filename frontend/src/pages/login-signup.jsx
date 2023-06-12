import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/img/logo.png'
import { BTN_ARROW } from '../assets/icons/icons'
import { useEffect, useState } from 'react'
import { userService } from '../services/user.service'
import { login, signup } from '../store/user.actions'
import { showErrorMsg } from '../services/event-bus.service'

export function LoginSignUp() {
	const [credentials, setCredentials] = useState(userService.getEmptyCredentials())
	const [isSignUp, setIsSignUp] = useState(false)
	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		setIsSignUp(location.pathname.includes('sign-up'))
	}, [location])

	function handleChange({ target }) {
		const field = target.name
		const value = target.value
		setCredentials(prev => ({ ...prev, [field]: value }))
	}

	async function onSubmit(ev) {
		ev.preventDefault()
		try {
			isSignUp ? await signup(credentials) : await login(credentials)
			navigate('/boards')
		} catch (err) {
			showErrorMsg(err?.response?.data || 'Something went wrong')
		}
	}

	const { fullname, email, password } = credentials

	return (
		<section className="login">
			<header className="main-header">
				<img src={logo} alt="logo" onClick={() => navigate('/')} />
			</header>

			<h1>Log in to your account</h1>

			<form onSubmit={onSubmit} className="input-container">
				{isSignUp && (
					<div className="flex column">
						<label htmlFor="fullname">Enter your full name</label>
						<input
							type="text"
							name="fullname"
							id="fullname"
							value={fullname}
							onChange={handleChange}
							placeholder="e.g. Jane Doe"
						/>
					</div>
				)}
				<div className="flex column">
					<label htmlFor="email">Enter your work email address</label>
					<input
						type="email"
						id="email"
						name="email"
						value={email}
						onChange={handleChange}
						placeholder="Example@company.com"
					/>
				</div>
				<div className="flex column">
					<label htmlFor="password">Enter your password</label>
					<input
						type="password"
						id="password"
						name="password"
						value={password}
						onChange={handleChange}
						placeholder="Enter at least 8 characters"
					/>
				</div>
				<button>
					<span>Next</span>
					<span className="btn-arrow">{BTN_ARROW}</span>
				</button>
			</form>

			<div className="separator-container">
				<div className="separator"></div>
				<h2> Or Sign in with</h2>
				<div className="separator"></div>
			</div>

			{!isSignUp ? (
				<div className="suggest-signup">
					<span>Don't have an account yet?</span>
					<Link to="/auth/sign-up"> Sign up</Link>
				</div>
			) : (
				<div className="suggest-login">
					<span>Already have an account?</span>
					<Link to="/auth/login"> Log in</Link>
				</div>
			)}
		</section>
	)
}
