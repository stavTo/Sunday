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
                    <div className="textarea-container">
                            <textarea wrap="hard"
                                type="text"
                                placeholder="Add a description here to make sure your team is aligned on the purpose of this board" />
                    </div>
                </div>
                <div className="info-container">
                    <span className="title">Board info</span>
                    <div className="Workspace flex column">
                        <span className="subtitle">Workspace</span>
                        <span>Main workspace</span>
                    </div>
                    <div className="created-by flex column">
                        <span className="subtitle">Created by</span>
                        <div className="flex align-center">
                            <span><img src={DEFAULT_USER} alt="" /> </span>
                            <span>08/06/2023</span>
                        </div>
                    </div>
                    <div className="owners flex column">
                        <span className="subtitle">Owners</span>
                        <div className="flex align-center">
                            <span> <img src={board.createdBy.imgUrl} alt="" /> </span>
                            <span>{board.createdBy.fullname}</span>
                        </div>
                    </div>
                    <div className="board-type flex column">
                        <span className="subtitle">Board type</span>
                        <div className="flex">
                            <span>{ICON_BOARD_LIST} </span>
                            <span> This board is public, visible to all team members.</span>
                        </div>
                    </div>
                </div>
            </section >

            <div className="modal-overlay" onClick={() => setIsInfoOpen(false)}></div>
        </>
    )
}
