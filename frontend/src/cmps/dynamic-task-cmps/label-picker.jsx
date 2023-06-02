import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffectUpdate } from '../../customHooks/useEffectUpdate'
import { EDIT_LABEL } from '../../assets/icons/icons'
import { saveTask } from '../../store/selected-board.actions'
import { SET_IS_MODAL_OPEN } from '../../store/selected-board.reducer'

const DEFAULT_STATUS_LABELS = [
	{ id: 'sl100', title: 'Done', color: '#00C875' },
	{ id: 'sl101', title: 'Working on it', color: '#fdab3d' },
	{ id: 'sl102', title: 'Stuck', color: '#e2445c' },
	{ id: 'sl103', title: 'Not Started', color: '#c4c4c4' },
]

const DEFAULT_PRIORITY_LABELS = [
	{ id: 'pl100', title: 'Critical', color: '#333333' },
	{ id: 'pl101', title: 'High', color: '#401694' },
	{ id: 'pl102', title: 'Medium', color: '#5559df' },
	{ id: 'pl103', title: 'Low', color: '#579bfc' },
	{ id: 'pl104', title: '', color: '#c4c4c4' },
]

export function LabelPicker({ type, task, groupId }) {
	const [isPickerOpen, setIsPickerOpen] = useState(false)
	const [label, setLabel] = useState({})
	const [labelsName, setLabelsName] = useState('')
	const labelPickerRef = useRef()
	const [isEditor, setIsEditor] = useState(false)

	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)

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

	function onPickerClose() {
		setIsEditor(false)
		setIsPickerOpen(false)
	}

	useEffectUpdate(() => {
		const labelTxt = type === 'statusPicker' ? task.status : task.priority
		setLabel(board[labelsName].find(l => l.title === labelTxt))
	}, [labelsName])

	function onPickerClose(ev) {
		if (!ev.target.closest('.label-picker-popup')) {
			setIsPickerOpen(false)
		}
	}

	function handleClick(ev) {
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
		<li className="label-picker" onClick={handleClick} style={{ backgroundColor: label?.color || '#C4C4C4' }}>
			<span>{label?.title || ''}</span>
			<div className="corner-fold"></div>

			{isPickerOpen &&
				(isEditor ? (
					<LabelPickerPopUpEditor board={board} labelsName={labelsName} onChangeLabel={onChangeLabel} />
				) : (
					<LabelPickerPopUp
						board={board}
						labelsName={labelsName}
						onChangeLabel={onChangeLabel}
						setIsEditor={setIsEditor}
					/>
				))}
		</li>
	)
}

function LabelPickerPopUp({ board, labelsName, onChangeLabel, setIsEditor }) {
	function onSetIsEditor() {
		setIsEditor(true)
	}

	return (
		<div className="label-picker-popup">
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
			<button className="edit-labels" onClick={onSetIsEditor}>
				<span>{EDIT_LABEL}</span>
				<span>Edit Labels</span>
			</button>
		</div>
	)
}

function LabelPickerPopUpEditor({ board, labelsName, onChangeLabel }) {
	return (
		<div className="label-picker-popup">
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
			<button className="edit-labels">
				<span>{EDIT_LABEL}</span>
				<span>Apply</span>
			</button>
		</div>
	)
}
