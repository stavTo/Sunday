import { saveTask } from '../../store/selected-board.actions'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { usePopper } from 'react-popper'
import { DateRange, DayPicker } from 'react-day-picker'
import { addDays, format } from 'date-fns'
import 'react-day-picker/dist/style.css'
import { ICON_CLOSE } from '../../assets/icons/icons'

export function TimelinePicker({ task, groupId }) {
    const [toggle, setToggle] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [hasTimeline, setHasTimeline] = useState(task.timeline)
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
    const pastMonth = new Date() // Define your past month date here

    const defaultSelected = {
        from: pastMonth,
        to: addDays(pastMonth, 4)
    };

    const [range, setRange] = useState(defaultSelected)

    useEffect(() => {
        if (range) {
            onChangeTimelineRange()
            // setHasRange(task)
            // * This line causes all timelines to render on component load
            // setToggle(!toggle)
        }
    }, [range])

    useEffect(() => {
        document.addEventListener('mousedown', onClosePicker)
        return () => {
            document.removeEventListener('mousedown', onClosePicker)
        }
    }, [])

    async function onChangeTimelineRange() {
        // setToggle(!toggle)
        const { timeline } = task
        const timelineToSave = {
            startDate: range.from.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            }),
            endDate: range.to.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            })
        }
        const taskToEdit = { ...task, timeline: timelineToSave }
        await saveTask(board._id, groupId, taskToEdit, '')
    }

    function onClosePicker(ev) {
        if (ev.target.closest('.timeline-container')) return
        setToggle(false)
    }

    function onToggleModal(ev) {
        if (ev.target.closest('.timeline-container')) return
        ev.stopPropagation()
        setToggle(prev => !prev)
    }

    function getEstTime() {
        const { timeline } = task
        const start = +timeline.startDate.slice(3)
        const end = +timeline.endDate.slice(3)
        const estTime = end - start
        return estTime
    }

    let footer = <p>Please pick the first day.</p>
    if (range?.from) {
        if (!range.to) {
            footer = <p>{format(range.from, 'PPP')}</p>
        } else if (range.to) {
            footer = (
                <p>
                    {format(range.from, 'PPP')}-{format(range.to, 'PPP')}
                </p>
            )
        }
    }

    async function clearTaskTimeline() {
        const taskToEdit = { ...task, timeline: null }
        setHasTimeline(taskToEdit.timeline)
        console.log("taskToEdit:", taskToEdit)
        await saveTask(board._id, groupId, taskToEdit, '')
    }

    const { timeline } = task
    return (
        <li className="timeline-picker flex align-center justify-center pointer"
            ref={setReferenceElement}
            onClick={ev => onToggleModal(ev)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <div className="timeline-container"
                ref={setPopperElement}>
                {task.timeline &&
                    <div className="span-container flex align-center justify-center">
                        <span className="range-preview flex row justify-center">
                            {isHovered ? <span>{getEstTime()}d</span> :
                                <span>{timeline.startDate} - {timeline.endDate}</span>
                            }
                        </span>
                        {isHovered && hasTimeline &&
                            <div className="reset-date-btn flex align-center"
                                onClick={() => clearTaskTimeline()}>
                                {ICON_CLOSE}
                            </div>
                        }
                    </div>
                }
                {toggle &&
                    <DayPicker
                        numberOfMonths={2}
                        mode="range"
                        defaultMonth={pastMonth}
                        selected={range}
                        footer={footer}
                        onSelect={setRange}
                    />
                }
            </div>
        </ li>
    )
}