import { BoardPreview } from '../index-cmps/board-preview.jsx'
import { ICON_EXPAND_ARROW } from '../../assets/icons/icons.js'
import { useState } from 'react'

export function BoardList({ boards }) {
    const [toggle, setToggle] = useState(true)


    return (
        <div className="list-wrapper">
            <h1 className="fs18 flex row gap-half text-cursor">
                <div className={`${toggle ? 'expand-arrow-container pointer' : 'close-arrow-container pointer'}`} onClick={() => setToggle(!toggle)}>
                    {ICON_EXPAND_ARROW}
                </div>Recently visited
            </h1>
            {toggle &&
                <ul className="clean-list flex row gap-1">
                    {boards && boards.map(board => {
                        return <li key={board._id}>
                            <BoardPreview board={board} />
                        </li>
                    })}
                </ul>
            }
        </div>
    )
}