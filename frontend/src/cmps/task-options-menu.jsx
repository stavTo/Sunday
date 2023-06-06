import { useParams } from "react-router";
import { ICON_ADD_GROUP, ICON_COPY_LINK, ICON_DUPLICATE, ICON_OPEN, ICON_TRASH } from "../assets/icons/icons";
import { Link } from "react-router-dom";
import { duplicateTask } from "../store/selected-board.actions";

export function TaskOptionsMenu({ task, group, onRemoveTask, setIsOptionOpen }) {

    const { boardId } = useParams()

    async function onDuplicateTask() {
        setIsOptionOpen(false)
        duplicateTask(boardId, group, task)
    }

    return (
        <section className="task-options-menu">
            <section className="options-menu">
                <Link className="btn-primary" to={`/boards/${boardId}/tasks/${task.id}`}>
                    <span className="option-group-icon" >{ICON_OPEN}</span>
                    <span className="title">Open</span>
                </Link>
                <div onClick={onDuplicateTask} className="btn-primary"  >
                    <span className="option-group-icon">{ICON_DUPLICATE}</span>
                    <span className="title"> Duplicate this task</span>
                </div>
                <div className="btn-primary">
                    <span className="option-group-icon">{ICON_COPY_LINK} </span>
                    <span className="title">Copy task link</span>
                </div>
                <div className="btn-primary">
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