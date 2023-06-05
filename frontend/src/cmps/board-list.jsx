import { BoardPreview } from '../cmps/board-preview.jsx'
import { ICON_EXPAND_ARROW } from '../assets/icons/icons'

export function BoardList({ boards }) {
    return (
        <div className="list-wrapper">
            <h1 className="fs18 flex row gap-half">
                <div className="expand-arrow-container">
                    {ICON_EXPAND_ARROW}
                </div>Recently visited</h1>
            <ul className="clean-list flex row">
                {boards && boards.map(board => {
                    return <li key={board._id}>
                        <BoardPreview board={board} />
                    </li>
                })}
            </ul>
        </div>
    )
}