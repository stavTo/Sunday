import { useEffect, useState } from 'react'
import { TippyContainer } from './tippy-container'
import { utilService } from '../services/util.service'

export function LabelsProgressBar({ board, group, type }) {
	const [labelsName, setLabelsName] = useState('')
	const [labelsNameInBoard, setLabelsNameInBoard] = useState('')

	useEffect(() => {
		if (type === 'statusPicker') {
			setLabelsName('status')
			setLabelsNameInBoard('statusLabels')
		} else if (type === 'priorityPicker') {
			setLabelsName('priority')
			setLabelsNameInBoard('priorityLabels')
		}
	}, [type])

	function getLabelColor(labelName) {
		const labels = board[labelsNameInBoard]
		const label = labels.find(l => l.title === labelName)
		return label.color
	}

	function getLabelRatio() {
		const mapCount = calcLabels()
		const labelNames = Object.keys(mapCount)
		const values = Object.values(mapCount)
		const sum = values.reduce((acc, val) => acc + val, 0)
		const valuesPercent = values.map(val => {
			if (val === 0) return
			return `${val}/${sum}`
		})

		return labelNames.map((label, idx) => ({
			[label]: valuesPercent[idx],
		}))
	}

	function calcLabels() {
		return group.tasks.reduce((acc, task) => {
			const status = task[labelsName]
			if (acc[status]) acc[status] += 1
			else acc[status] = 1
			return acc
		}, {})
	}

	if (!labelsNameInBoard) return

	return (
		<div className="labels-progress-bar">
			<ul className="list-labels-progress-bar flex">
				{getLabelRatio().map((val, idx) => {
					const label = Object.keys(val)[0]
					const widthFraction = val[label]
					const widthPercent = utilService.fractionToPercent(widthFraction).toFixed(1)
					return (
						<TippyContainer key={idx} txt={`${label} ${widthFraction} ${widthPercent}%`}>
							<li
								className="progress-bar-item"
								style={{
									backgroundColor: getLabelColor(label),
									width: widthPercent + '%',
									height: '100%',
								}}
							></li>
						</TippyContainer>
					)
				})}
			</ul>
		</div>
	)
}
