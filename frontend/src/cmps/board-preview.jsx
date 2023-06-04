import img from '../assets/img/quick_search_recent_board.svg'
import {
    ICON_BOARD_LIST,
    ICON_STAR,
    ICON_WORK_MANAGEMENT
} from '../assets/icons/icons'
export function BoardPreview({ board }) {


    return (
        <div className="board-preview pointer">
            <img src={img} />
            <div className="board-title flex row align-center space-between">
                <div className="title-and-icon flex row align-center">
                    {ICON_BOARD_LIST}
                    <h3>{board.title}</h3>
                </div>
                <div className="btn-primary">
                    {ICON_STAR}
                </div>
                <div className="path-description">
                    {ICON_WORK_MANAGEMENT}Work management
                </div>
            </div>
        </div>
    )
}