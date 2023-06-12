import { eventBus } from '../services/event-bus.service.js'
import { useState, useEffect, useRef } from 'react'
import { socketService, SOCKET_EVENT_REVIEW_ABOUT_YOU } from '../services/socket.service.js'
import { ICON_CLOSE, ICON_ERROR } from '../assets/icons/icons.js'

export function UserMsg() {
	const [msg, setMsg] = useState(null)
	const timeoutIdRef = useRef()

	useEffect(() => {
		const unsubscribe = eventBus.on('show-msg', msg => {
			setMsg(msg)
			window.scrollTo({ top: 0, behavior: 'smooth' })
			if (timeoutIdRef.current) {
				timeoutIdRef.current = null
				clearTimeout(timeoutIdRef.current)
			}
			timeoutIdRef.current = setTimeout(closeMsg, 3000)
		})

		return () => {
			unsubscribe()
			socketService.off(SOCKET_EVENT_REVIEW_ABOUT_YOU)
		}
	}, [])

	function closeMsg() {
		setMsg(null)
	}

	if (!msg) return <span></span>
	return (
		<section className={`user-msg ${msg.type}`}>
			{msg.type === 'error' && ICON_ERROR}
			{msg.txt}
			<button onClick={closeMsg}>{ICON_CLOSE}</button>
		</section>
	)
}
