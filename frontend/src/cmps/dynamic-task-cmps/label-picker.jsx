import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useEffectUpdate } from '../../customHooks/useEffectUpdate'
import { EDIT_LABEL, ICON_CLOSE, ICON_COLOR_BUCKET } from '../../assets/icons/icons'
import { saveTask, updateLabels } from '../../store/selected-board.actions'
import { boardService } from '../../services/board.service'
import { usePopper } from 'react-popper'
import { showErrorMsg } from '../../services/event-bus.service'
import { ColorPicker } from '../color-picker'

export function LabelPicker({ type, task, groupId, defaultWidth }) {
	const [isPickerOpen, setIsPickerOpen] = useState(false)
	const [label, setLabel] = useState({})
	const [labelsName, setLabelsName] = useState('')
	const [isEditor, setIsEditor] = useState(false)
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)

	const [referenceElement, setReferenceElement] = useState(null)
	const [popperElement, setPopperElement] = useState(null)
	const [arrowElement, setArrowElement] = useState(null)
	const { styles, attributes } = usePopper(referenceElement, popperElement, {
		modifiers: [
			{ name: 'arrow', options: { element: arrowElement } },
			{ name: 'offset', options: { offset: [0, 8] } },
		],
	})

	useEffect(() => {
		if (type === 'statusPicker') {
			setLabelsName('statusLabels')
		} else if (type === 'priorityPicker') {
			setLabelsName('priorityLabels')
		}
	}, [task, type])

	useEffect(() => {
		document.addEventListener('mousedown', onPickerClose)
		return () => {
			document.removeEventListener('mousedown', onPickerClose)
		}
	}, [])

	useEffectUpdate(() => {
		const labelId = type === 'statusPicker' ? task.status : task.priority
		const label = board[labelsName]?.find(l => l.id === labelId)
		setLabel(label)
	}, [labelsName, board])

	function onPickerClose(ev) {
		if (!ev.target.closest('.label-picker-popup')) {
			setIsPickerOpen(false)
			setIsEditor(false)
		}
	}

	function handleClick() {
		setIsPickerOpen(true)
	}

	async function onChangeLabel(ev, label) {
		ev.stopPropagation()
		setIsPickerOpen(false)
		const labelTaskName = labelsName === 'statusLabels' ? 'status' : 'priority'
		const oldLabel = board[labelsName]?.find(l => l.id === task[labelTaskName])
		const taskToEdit = { ...task }
		taskToEdit[labelTaskName] = label.id
		try {
			const action = {
				description: taskToEdit.title,
				fromLabel: oldLabel,
				toLabel: label,
				type: 'Label',
			}
			await saveTask(board._id, groupId, taskToEdit, action)
			setLabel(label)
		} catch (err) {
			showErrorMsg('Cant change label')
		}
	}

	return (
		<li
			style={{ backgroundColor: label?.color || '#C4C4C4', width: defaultWidth }}
			className="label-picker"
			ref={setReferenceElement}
			onClick={handleClick}
		>
			<span>{label?.title || ''}</span>
			<div className="corner-fold"></div>
			{isPickerOpen &&
				(isEditor ? (
					<LabelPickerPopUpEditor
						popperRef={setPopperElement}
						board={board}
						labelsName={labelsName}
						styles={styles}
						setArrowElement={setArrowElement}
						attributes={attributes}
						setIsEditor={setIsEditor}
					/>
				) : (
					<LabelPickerPopUp
						popperRef={setPopperElement}
						board={board}
						labelsName={labelsName}
						onChangeLabel={onChangeLabel}
						setIsEditor={setIsEditor}
						label={label}
						styles={styles}
						setArrowElement={setArrowElement}
						attributes={attributes}
					/>
				))}
		</li>
	)
}

function LabelPickerPopUp({
	board,
	labelsName,
	onChangeLabel,
	setIsEditor,
	styles,
	popperRef,
	setArrowElement,
	attributes,
}) {
	return (
		<div className="label-picker-popup" ref={popperRef} style={styles.popper} {...attributes.popper}>
			<div className="modal-up-arrow" ref={setArrowElement} style={styles.arrow}></div>
			<ul className="labels-list clean-list">
				{board[labelsName].map(label => (
					<li
						key={label.id}
						style={{ backgroundColor: label.color }}
						onClick={ev => onChangeLabel(ev, label)}
					>
						{label.title}
					</li>
				))}
			</ul>
			<div className="separator"></div>
			<button className="edit-labels" onClick={() => setIsEditor(true)}>
				<span className="icon">{EDIT_LABEL}</span>
				<span className="title">Edit Labels</span>
			</button>
		</div>
	)
}

function LabelPickerPopUpEditor({ board, labelsName, styles, popperRef, setArrowElement, attributes, setIsEditor }) {
	const [boardLabels, setBoardLabels] = useState(board[labelsName])
	const [isPalleteOpen, setIsPalleteOpen] = useState(false)
	const [labelToEdit, setLabelToEdit] = useState({})

	useEffect(() => {
		document.addEventListener('mousedown', onEditorClose)
		return () => {
			document.removeEventListener('mousedown', onEditorClose)
		}
	}, [])

	function onEditorClose(ev) {
		if (!ev.target.closest('.label-picker-popup')) {
			onSaveLabels()
			setIsEditor(false)
		}
	}

	function handleChange({ target }) {
		const field = target.name
		const value = target.value
		const newLabels = boardLabels.map(l => (l.id !== field ? l : { ...l, title: value }))
		setBoardLabels(newLabels)
	}

	function onAddNewLabel() {
		const newLabel = boardService.getEmptyLabel()
		setBoardLabels(prev => [...prev, newLabel])
	}

	function onRemoveLabel(labelId) {
		const labelTaskName = labelsName === 'statusLabels' ? 'status' : 'priority'
		const isUse = board.groups.some(g => g.tasks.some(t => t[labelTaskName] === labelId))
		if (isUse) return showErrorMsg('You cant delete label while in use')
		const newLabels = board[labelsName].filter(l => l.id !== labelId)
		updateLabels(board, labelsName, newLabels)
	}

	async function onSaveLabels() {
		try {
			await updateLabels(board, labelsName, boardLabels)
		} catch (err) {
			showErrorMsg('Cant edit label')
		} finally {
			setIsEditor(false)
		}
	}

	function setLabelStyle(newStyle) {
		try {
			const labelsToUpdate = boardLabels.map(l =>
				l.id === labelToEdit.id ? { ...labelToEdit, color: newStyle.color } : l
			)
			updateLabels(board, labelsName, labelsToUpdate)
		} catch {
			showErrorMsg('Cant update style')
		}
	}

	function onSetLabelStyle(label) {
		if (label.id.includes('104')) return showErrorMsg('Cant change default color')
		setIsPalleteOpen(prev => !prev)
		setLabelToEdit(label)
	}

	function onSetColorPickerClose(ev) {
		if (ev.target.closest('.color-picker')) return
		setIsPalleteOpen(false)
	}

	if (!board[labelsName].length) return

	return (
		<div className="label-picker-popup" style={styles.popper} {...attributes.popper} ref={popperRef}>
			{isPalleteOpen && (
				<ColorPicker
					onSetColorPickerClose={onSetColorPickerClose}
					setIsColorPickerOpen={setIsPalleteOpen}
					setEntityStyle={setLabelStyle}
				/>
			)}
			<div className="modal-up-arrow" ref={setArrowElement} style={styles.arrow}></div>
			<ul className="labels-input-list clean-list">
				{boardLabels.map(label => {
					return (
						<li key={label.id} className="edit-label">
							<div className="input-container">
								<span className="remove-label-btn" onClick={() => onRemoveLabel(label.id)}>
									{ICON_CLOSE}
								</span>
								<span
									className="icon-color-bucket"
									style={{ backgroundColor: label.color }}
									onClick={() => onSetLabelStyle(label)}
								>
									{ICON_COLOR_BUCKET}
								</span>
								<input type="text" value={label.title} name={label.id} onChange={handleChange}></input>
							</div>
						</li>
					)
				})}
			</ul>
			<div className="new-label-btn" onClick={onAddNewLabel}>
				+ New label
			</div>
			<div className="separator"></div>
			<button className="edit-labels" onClick={onSaveLabels}>
				<span className="icon">{EDIT_LABEL}</span>
				<span className="title">Apply</span>
			</button>
		</div>
	)
}
