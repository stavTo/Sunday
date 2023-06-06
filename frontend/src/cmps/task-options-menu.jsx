import { useParams } from "react-router";
import { ICON_ADD_GROUP, ICON_COPY_LINK, ICON_DUPLICATE, ICON_OPEN, ICON_TRASH } from "../assets/icons/icons";
import { Link } from "react-router-dom";
import { duplicateTask, removeTask } from "../store/selected-board.actions";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service";

export function TaskOptionsMenu({ task, group, setIsOptionOpen }) {

    const { boardId } = useParams()

    async function onDuplicateTask(boolean) {
        setIsOptionOpen(false)
        try {
            await duplicateTask(boardId, group, task, boolean)
        } catch {
            showErrorMsg('cant duplicate task')
        }
    }

    async function onRemoveTask() {
        setIsOptionOpen(false)
        try {
            console.log(task.id)
            await removeTask(boardId, task.id)
        } catch {
            showErrorMsg('cant delete task')
        }
    }

    async function getUrlTaskDetails() {
        setIsOptionOpen(false)
        try {
            await navigator.clipboard.writeText(window.location.href + `/tasks/${task.id}`)
            showSuccessMsg('Link copied')
        } catch (err) {
            console.log('Failed to copy URL to clipboard')
        }
    }

    return (
        <section className="task-options-menu">
            <section className="options-menu">
                <Link className="btn-primary" to={`/boards/${boardId}/tasks/${task.id}`}>
                    <span className="option-group-icon" >{ICON_OPEN}</span>
                    <span className="title">Open</span>
                </Link>
                <div onClick={() => onDuplicateTask(true)} className="btn-primary"  >
                    <span className="option-group-icon">{ICON_DUPLICATE}</span>
                    <span className="title"> Duplicate this task</span>
                </div>
                <div onClick={getUrlTaskDetails} className="btn-primary">
                    <span className="option-group-icon">{ICON_COPY_LINK} </span>
                    <span className="title">Copy task link</span>
                </div>
                <div onClick={() => onDuplicateTask(false)} className="btn-primary">
                    <span className="option-group-icon">{ICON_ADD_GROUP}</span>
                    <span className="title"> Create new task below</span>
                </div>
                <div onClick={onRemoveTask} className="remove-group btn-primary">
                    <span className="option-group-icon">{ICON_TRASH}</span>
                    <span className="title"> Delete task</span>
                </div>
            </section>
        </section>
    )
}