import { useEffect, useState } from 'react'

export function contentEditable({ className, defaultTxt, onSet }) {
	const [txtToEdit, setTxtToEdit] = useState(defaultTxt)
	const [isInputVisible, setIsInputVisible] = useState(false)

	useEffect(() => {
		document.addEventListener('click', setInputInvisible)
		return () => {
			document.removeEventListener('click', setInputInvisible)
		}
	}, [])

	function setInputInvisible() {
		setIsInputVisible(false)
	}

	function handleKeyPressed(key) {
		if (key.key === 'Enter') onSetTxt()
		if (key.key === 'Escape') onEmptyInput()
	}

	function onEmptyInput() {
		setTxtToEdit(defaultTxt)
		setIsInputVisible(false)
	}

	function handleClick(ev) {
		ev.stopPropagation()
		setIsInputVisible(prev => !prev)
	}

	async function onSetTxt() {
		setIsInputVisible(false)
		onSet()
	}

	function handleChange({ target }) {
		setTxtToEdit(target.value)
	}

	return (
		<div className={className}>
			{!isInputVisible && <div onClick={handleClick}>{defaultTxt}</div>}
			{isInputVisible && (
				<input
					autoFocus={true}
					onBlur={onSetTxt}
					onClick={ev => ev.stopPropagation()}
					onKeyDown={handleKeyPressed}
					className="title-input"
					id="title"
					name="title"
					value={txtToEdit}
					onChange={handleChange}
				></input>
			)}
		</div>
	)
}
