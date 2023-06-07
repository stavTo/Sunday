import { useEffect } from 'react'
import { loadBoards } from '../store/board.actions'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import {
    ICON_BOARD_LIST,
    ICON_OPTIONS,
    ICON_STAR_STARRED,
} from '../assets/icons/icons'


export function FavoritesList() {
    const boards = useSelector(({ boardModule }) => boardModule.boards)

    useEffect(() => {
        onLoadBoards()
    }, [])

    async function onLoadBoards() {
        try {
            await loadBoards()
        } catch {
            console.log("couldn't load boards")
        }
    }

    return (
        <section className="workspace-board-list">
            <div className="board-list-header flex column">
                <div className="workspace-title flex align-center">
                    <h4>Favorites</h4>
                    <h4>{ICON_STAR_STARRED}</h4>
                </div>
            </div>
            <ul className="board-list clean-list flex column">
                {boards.map(board => {
                    if (board.isStarred) {
                        return (<li className="board-title-preview flex pointer" key={board._id}>
                            <Link to={`/boards/${board._id}`}>
                                {ICON_BOARD_LIST}
                                <span>
                                    {board.title}
                                </span>
                            </Link>
                            <span className="options">{ICON_OPTIONS}</span>
                        </li>)
                    }
                })}
            </ul>
        </section>
    )
}