import { useEffect } from 'react'
import { loadBoards } from '../store/board.actions'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import {
    ICON_BOARD_LIST,
    ICON_OPTIONS,
    ICON_STAR_STARRED,
} from '../assets/icons/icons'

import imgNoFavorites from '../assets/img/favorites-no-bg.gif'

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
    const boardsStarredLength = boards.filter(b => b.isStarred)

    return (
        <section className="workspace-board-list">
            <div className="board-list-header flex column">
                <div className="favorites-title">
                    <h4 className="icon-star">{ICON_STAR_STARRED}</h4>
                    <h4>Favorites</h4>
                </div>
            </div>
            <div className="separator"></div>
            {!!boardsStarredLength.length
                ?
                (<ul className="board-list clean-list flex column">
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
                </ul>)
                :
                (<div className="empty-favorites">
                    <img src={imgNoFavorites} alt="" />
                    <span>No favorite boards yet</span>
                    <p>"Star" any board so what you can 
                        easily access it later
                    </p>
                </div>)
            }
        </section>
    )
}