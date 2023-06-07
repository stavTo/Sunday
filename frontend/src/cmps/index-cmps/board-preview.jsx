import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { saveBoard } from '../../store/selected-board.actions'
import { TippyContainer } from '../tippy-container'
import img from '../../assets/img/quick_search_recent_board.svg'
import {
    ICON_BOARD_LIST,
    ICON_STAR,
    ICON_WORK_MANAGEMENT
} from '../../assets/icons/icons'
export function BoardPreview({ board }) {

    function onToggleStarState() {
        const isStarred = board.isStarred
        const newBoard = { ...board, isStarred: !isStarred }
        console.log("board:", board)
        console.log("hey:", newBoard)
        saveBoard(newBoard)
    }

    return (
        <div className="board-preview pointer">
            <img src={img} />
            <div className="board-title flex column align-center space-between">
                <div className="preview-header flex row align-center space-between w-100">
                    <Link to={`/boards/${board._id}`}>
                        <div className="title flex row align-center">
                            {ICON_BOARD_LIST}
                            <span>{board.title}</span>
                        </div>
                    </Link>
                    {!board.isStarred && (
                        <TippyContainer txt="Add to favorites">
                            <div className="star-icon header-icon btn-primary" onClick={onToggleStarState}>
                                {ICON_STAR}
                            </div>
                        </TippyContainer>
                    )}
                    {
                        board.isStarred && (
                            <TippyContainer txt="Remove from favorites">
                                <div className="star-icon header-icon btn-primary starred" onClick={onToggleStarState}>
                                    {ICON_STAR}
                                </div>
                            </TippyContainer>
                        )
                    }
                </div>
                <div className="preview-footer">
                    {ICON_WORK_MANAGEMENT}
                    <span>Work management > Main workspace</span>
                </div>
            </div>
        </div>
    )
}