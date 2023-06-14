import { useCallback, useRef, useState } from 'react'

export function useLongPress(onLongPress, onClick, { shouldPreventDefault = true, delay = 800 }) {
	const [longPressTriggered, setLongPressTriggered] = useState(false)
	const timeout = useRef()
	const target = useRef()

	const start = useCallback(
		event => {
			if (shouldPreventDefault && event.target) {
				event.target.addEventListener('touchend', preventDefault, {
					passive: false,
				})
				target.current = event.target
			}
			timeout.current = setTimeout(() => {
				onLongPress(event)
				setLongPressTriggered(true)
			}, delay)
		},
		[onLongPress, delay, shouldPreventDefault]
	)

	const clear = useCallback(
		(event, shouldTriggerClick = true) => {
			timeout.current && clearTimeout(timeout.current)
			shouldTriggerClick && !longPressTriggered && onClick()
			setLongPressTriggered(false)
			if (shouldPreventDefault && target.current) {
				target.current.removeEventListener('touchend', preventDefault)
			}
		},
		[shouldPreventDefault, onClick, longPressTriggered]
	)

	return {
		onTouchStart: e => start(e),
		onTouchMove: e => clear(e, false),
		onTouchEnd: e => clear(e),
	}
}

function isTouchEvent(ev) {
	return 'touches' in ev
}

function preventDefault(ev) {
	if (!isTouchEvent(ev)) return

	if (ev.touches.length < 2 && ev.preventDefault) {
		ev.preventDefault()
	}
}
