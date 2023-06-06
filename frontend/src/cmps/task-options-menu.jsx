import { duplicateGroup } from "../store/selected-board.actions";
import { useParams } from "react-router";
import { ICON_ADD_GROUP, ICON_COPY_LINK, ICON_DUPLICATE, ICON_OPEN, ICON_TRASH } from "../assets/icons/icons";

export function TaskOptionsMenu({ onRemoveGroup, openColorPicker, group, setIsOptionOpen }) {
    const { boardId } = useParams()

    async function onDuplicateGroup() {
        setIsOptionOpen(false)
        duplicateGroup(boardId, group)
    }

    return (
        <section className="options-menu">
            <div className="btn-primary">
                <span className="option-group-icon" >{ICON_OPEN}</span>
                <span className="title">Open</span>
            </div>
            <div className="btn-primary" onClick={onDuplicateGroup} >
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
            <div onClick={onRemoveGroup} className="remove-group btn-primary">
                <span className="option-group-icon">{ICON_TRASH}</span>
                <span className="title"> Delete task</span>
            </div>
        </section>
    )
}