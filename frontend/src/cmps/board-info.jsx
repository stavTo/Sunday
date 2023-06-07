import { TfiClose } from "react-icons/tfi";
import { DEFAULT_USER, ICON_BOARD_LIST } from "../assets/icons/icons";


export function BoardInfo({ board, setIsInfoOpen }) {




    return (
        <>
            <section className="board-info-modal">
                <div className="editor-container">
                    <span className="close-modal-btn btn-primary" onClick={() => setIsInfoOpen(false)}>
                        <TfiClose />
                    </span>
                    <span className="modal-title">{board.title}</span>
                    <textarea type="text" placeholder="Add a description here to make sure your team is aligned on the purpose of this board" />
                </div>
                <div className="info-container">
                    <span>Board info</span>
                    <span>Workspace</span>
                    <span>Main workspace</span>
                    <span>Created by</span>
                    <span>
                        <img src={DEFAULT_USER} alt="" />
                        Stav Tohami</span>
                    <span>Board type</span>
                    <span>{ICON_BOARD_LIST} This board is public, visible to all team members.</span>
                </div>
            </section>

            <div className="modal-overlay" onClick={() => setIsInfoOpen(false)}></div>
        </>
    )
}
