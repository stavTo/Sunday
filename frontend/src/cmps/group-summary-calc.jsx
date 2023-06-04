import { useEffect, useState } from "react"
import { TippyContainer } from "./tippy-container";

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

    function getColor(labelName) {
        const labels = board[labelsNameInBoard]
        const label = labels.find((l) => l.title === labelName);
        return label.color
    }

    function precentOfLabels() {
        const mapCount = calcLabels()
        const labelNames = Object.keys(mapCount)
        const values = Object.values(mapCount)
        const sum = values.reduce((acc, val) => acc + val, 0)
        const valuesPrecent = values.map(val => {
            if (val === 0) return
            return val = (val / sum) * 100
        })

        return labelNames.map((label, idx) => ({
            [label]: valuesPrecent[idx],
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
                {precentOfLabels().map((val, idx) => {
                    const label = Object.keys(val)[0]
                    const width = val[label]
                    return <TippyContainer key={idx} txt={`${label + ' ' + width.toFixed(1) + '%'}`}>
                        <li
                            className={`progress-bar-item item-${idx}`}
                            style={{
                                backgroundColor: getColor(label),
                                width: width + "%",
                                height: 100 + "%"
                            }}>
                        </li>
                    </TippyContainer>
                })}
            </ul>
        </div>
    )
}
