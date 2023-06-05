import { faCirclePlus, faCopy, faDownLeftAndUpRightToCenter, faSquareCheck, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addGroup } from "../store/selected-board.actions";
import { useParams } from "react-router";

export function OptionsMenu({ onRemoveGroup, openColorPicker, group }) {

    const { boardId } = useParams()

    return (
        <section className="options-menu">
            <div className="btn-primary">
                <span><FontAwesomeIcon icon={faDownLeftAndUpRightToCenter} style={{ color: "#676879", rotate: "-45deg" }} /></span>
                <span className="title">Collapse group</span>
            </div>
            <div className="btn-primary">
                <span><FontAwesomeIcon icon={faSquareCheck} style={{ color: "#676879" }} /> </span>
                <span className="title">Select all tasks</span>
            </div>
            <div className="btn-primary">
                <span><FontAwesomeIcon icon={faCirclePlus} style={{ color: "#676879" }} /></span>
                <span className="title"> Add group</span>
            </div>
            <div className="btn-primary" onClick={() => addGroup(boardId, false)} >
                <span><FontAwesomeIcon icon={faCopy} style={{ color: "#676879" }} /> </span>
                <span className="title"> Duplicate this group</span>
            </div>
            <div className="change-color btn-primary"
                onClick={openColorPicker}>
                <div className="color-icon" style={{ backgroundColor: group.style.color }}></div>
                <span className="title"> Change group color</span>
            </div>
            <div onClick={onRemoveGroup} className="remove-group btn-primary">
                <span><FontAwesomeIcon icon={faTrashCan} style={{ color: "#676879" }} /></span>
                <span className="title"> Delete group</span>
            </div>
        </section>
    )
}