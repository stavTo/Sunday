import { Link } from 'react-router-dom'
import img from '../../assets/img/quick_search_recent_board.svg'
import {
    ICON_BOARD_LIST,
    ICON_STAR,
    ICON_WORK_MANAGEMENT
} from '../../assets/icons/icons'
export function BoardPreview({ board }) {


    return (
        <Link to={`/boards/${board._id}`}>
            <div className="board-preview pointer">
                <img src={img} />
                <div className="board-title flex column align-center space-between">
                    <div className="preview-header flex row align-center space-between w-100">
                        <div className="title flex row align-center">
                            {ICON_BOARD_LIST}
                            <span>{board.title}</span>
                        </div>
                        <div className="btn-primary">
                            {ICON_STAR}
                        </div>
                    </div>
                    <div className="preview-footer">
                        {ICON_WORK_MANAGEMENT}
                        <span>Work management > Main workspace</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}