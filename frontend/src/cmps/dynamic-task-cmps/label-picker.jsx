import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useEffectUpdate } from '../../customHooks/useEffectUpdate'
import { EDIT_LABEL } from '../../assets/icons/icons'
import { faL } from '@fortawesome/free-solid-svg-icons'
import { func } from 'prop-types'
import { updateLabelInTask } from '../../store/selected-board.actions'

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
	const [labelTxt, setLabelTxt] = useState('')
	const [labelsName, setLabelsName] = useState('')
	const [labelTaskName, setLabelTaskName] = useState('')
	const [isEditor, setIsEditor] = useState(false)

	console.log(isEditor)
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)

	useEffect(() => {
		if (type === 'statusPicker') {
			setLabelTxt(task.status)
			setLabelsName('statusLabels')
			setLabelTaskName('status')
		}
		else if (type === 'priorityPicker') {
			setLabelTxt(task.priority)
			setLabelsName('priorityLabels')
			setLabelTaskName('priority')
		}
	}, [task, type])

	useEffect(() => {
		document.addEventListener('click', () => onPickerClose(false))
		return () => {
			document.removeEventListener('click', () => onPickerClose(false))
		}
	}, [])

	function onPickerClose() {
		setIsEditor(false)
		setIsPickerOpen(false)
	}

	useEffectUpdate(() => {
		setLabel(board[labelsName].find(l => l.title === labelTxt))
	}, [labelTxt])

	function onChangeLabel(label) {
		updateLabelInTask(board._id, groupId, task.id, labelTaskName, label)
		setLabel(label)
	}

	function handleClick(ev) {
		ev.stopPropagation()
		setIsPickerOpen(prev => !prev)

		//TODO in default app, every click closes picker no matter where clicked.
	}

	return (
		<li className="label-picker"
			onClick={handleClick}
			style={{ backgroundColor: label?.color || '#C4C4C4' }}>
			<span>{label?.title || ''}</span>
			<div className="corner-fold"></div>

			{isPickerOpen && (isEditor ?
				<LabelPickerPopUpEditor
					board={board}
					labelsName={labelsName}
					onChangeLabel={onChangeLabel}
				/>
				:
				<LabelPickerPopUp
					board={board}
					labelsName={labelsName}
					onChangeLabel={onChangeLabel}
					setIsEditor={setIsEditor}
				/>
			)}
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
					<li key={label.id}
						style={{ backgroundColor: label.color }}
						onClick={() => onChangeLabel(label)}>
						{label.title}
					</li>
				))}
			</ul>
			<div className="sperator"></div>
			<button className="edit-labels"
				onClick={onSetIsEditor}>
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
					<li key={label.id}
						style={{ backgroundColor: label.color }}
						onClick={() => onChangeLabel(label)}>
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