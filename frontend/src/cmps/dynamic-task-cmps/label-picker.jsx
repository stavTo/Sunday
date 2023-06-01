import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useEffectUpdate } from '../../customHooks/useEffectUpdate'

const DEFAULT_LABELS = [
	{ title: 'Done', color: '#00C875' },
	{ title: 'Working on it', color: '##FDAB3D' },
]

export function LabelPicker({ type, task, groupId }) {
	const [isPickerOpen, setIsPickerOpen] = useState(false)
	const [label, setLabel] = useState({})
	const [labelName, setLabelName] = useState('')
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)

	useEffect(() => {
		if (type === 'status-picker') setLabelName(task.status)
		else if (type === 'priority-picker') setLabelName(task.priority)
	}, [task, type])

	useEffectUpdate(() => {
		setLabel(board.labels.find(l => l.title === labelName))
	}, [labelName])

	function handleClick() {
		//TODO in default app, every click closes picker no matter where clicked.
		setIsPickerOpen(prev => !prev)
	}

	return (
		<li className="label-picker" onClick={handleClick} style={{ backgroundColor: label?.color || '#C4C4C4' }}>
			<div className="corner-fold"></div>
			<span>{labelName}</span>
			{isPickerOpen && (
				<div className="label-picker-popup">
					<ul className="clean-list">
						{board.labels.map(label => (
							<li key={label.id} style={{ backgroundColor: label.color }}>
								{label.title}
							</li>
						))}
					</ul>
				</div>
			)}
		</li>
	)
}
