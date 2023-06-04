import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useEffectUpdate } from '../../customHooks/useEffectUpdate'
import { EDIT_LABEL } from '../../assets/icons/icons'
import { saveTask, updateLabels } from '../../store/selected-board.actions'
import { boardService } from '../../services/board.service.local'
import { usePopper } from 'react-popper'

// const DEFAULT_STATUS_LABELS = [
// 	{ id: 'sl100', title: 'Done', color: '#00C875' },
// 	{ id: 'sl101', title: 'Working on it', color: '#fdab3d' },
// 	{ id: 'sl102', title: 'Stuck', color: '#e2445c' },
// 	{ id: 'sl103', title: 'Not Started', color: '#c4c4c4' },
// ]

// const DEFAULT_PRIORITY_LABELS = [
// 	{ id: 'pl100', title: 'Critical', color: '#333333' },
// 	{ id: 'pl101', title: 'High', color: '#401694' },
// 	{ id: 'pl102', title: 'Medium', color: '#5559df' },
// 	{ id: 'pl103', title: 'Low', color: '#579bfc' },
// 	{ id: 'pl104', title: '', color: '#c4c4c4' },
// ]

export function LabelPicker({ type, task, groupId }) {
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
		const labelTxt = type === 'statusPicker' ? task.status : task.priority
		setLabel(board[labelsName].find(l => l.title === labelTxt))
	}, [labelsName])

	function onPickerClose(ev) {
		if (!ev.target.closest('.label-picker-popup')) {
			setIsPickerOpen(false)
			setIsEditor(false)
		}
	}

	function handleClick() {
		setIsPickerOpen(true)
	}

	function onChangeLabel(ev, label) {
		ev.stopPropagation()
		setIsPickerOpen(false)
		const labelTaskName = labelsName === 'statusLabels' ? 'status' : 'priority'
		const taskToEdit = { ...task }
		taskToEdit[labelTaskName] = label.title
		saveTask(board._id, groupId, taskToEdit, 'changed label')
		setLabel(label)
	}

	return (
		<li
			className="label-picker"
			ref={setReferenceElement}
			onClick={handleClick}
			style={{ backgroundColor: label?.color || '#C4C4C4' }}>
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
						onClick={ev => onChangeLabel(ev, label)}>
						{label.title}
					</li>
				))}
			</ul>
			<div className="sperator"></div>
			{/* <button className="edit-labels" onClick={() => setIsEditor(true)}>
				<span>{EDIT_LABEL}</span>
				<span>Edit Labels</span>
			</button> */}
		</div>
	)
}

function LabelPickerPopUpEditor({ board, labelsName, styles, popperRef, setArrowElement, attributes }) {
	const [boardLabels, setBoardLabels] = useState(board[labelsName])
	// const [labelToEdit, setLabelToEdit] = useState(label)

	// useEffect(() => {
	// 	setBoardLabels()
	// }, [])

	function handleChange({ target }) {
		const field = target.name
		const value = target.value
		const x = boardLabels.map(l => (l.id !== field ? l : { ...l, title: value }))
		console.log(x)

		setBoardLabels(x)
	}

	function addNewLabel() {
		const newLabel = boardService.getEmptyLabel()
		const newLabels = [...board[labelsName], newLabel]
		updateLabels(board, labelsName, newLabels)
	}

	function removeLabel(labelId) {
		const newLabels = board[labelsName].filter(l => l.id !== labelId)
		updateLabels(board, labelsName, newLabels)
	}
	return (
		<div className="label-picker-popup" style={styles.popper} {...attributes.popper} ref={popperRef}>
			<div className="modal-up-arrow" ref={setArrowElement} style={styles.arrow}></div>
			<ul className="labels-input-list clean-list">
				{board[labelsName].map(label => (
					<li key={label.id}>
						<div className="input-container">
							<span className="remove-label-btn" onClick={() => removeLabel(label.id)}>
								X
							</span>
							<input type="text" value={label.title} name={label.id} onChange={handleChange} />
						</div>
					</li>
				))}
			</ul>
			<button onClick={addNewLabel}>+ New label</button>
			<div className="sperator"></div>
			<button className="edit-labels">
				<span>{EDIT_LABEL}</span>
				<span>Apply</span>
			</button>
		</div>
	)
}
