import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/scale-subtle.css'
import { roundArrow } from 'tippy.js'

export function setTippy(cssSelector, content, placement, offset) {
	tippy(`${cssSelector}`, {
		placement,
		content,
		offset,
		animation: 'scale-subtle',
		delay: [400, 0],
		duration: [100, 0],
		theme: 'default',
	})
}
