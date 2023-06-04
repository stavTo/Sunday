import { BoardPreview } from '../cmps/board-preview.jsx'

export function BoardList({ boards }) {
    return (
        <div className="list-wrapper">
            <h2>Recently visited</h2>
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