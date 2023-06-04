import { useEffect } from 'react'
import { SideBar } from '../cmps/side-bar'
import { loadBoards } from '../store/board.actions'
import { useSelector } from 'react-redux'
import { showErrorMsg } from '../services/event-bus.service'
import { BoardLoader } from '../cmps/BoardLoader'
import { BoardIndexHeader } from '../cmps/boards-index-header.jsx'
import { BoardList } from '../cmps/board-list.jsx'

export function BoardIndex() {
    const boards = useSelector(({ boardModule }) => boardModule.boards)
    document.title = 'My Boards'

    useEffect(() => {
        onLoadBoards()
        // loadBoards()
    }, [])

    async function onLoadBoards() {
        try {
            await loadBoards()
        } catch {
            showErrorMsg(`Board could not be loaded`)
        }
    }


    if (!boards) return <BoardLoader />

    return (
        <section className="board-index">
            <SideBar isExpandable={false} />
            <section className="index-body">
                <section className="index-container">
                    <div className="header-wrapper">
                        <BoardIndexHeader />
                    </div>
                    <section className="boards-list">
                        <BoardList boards={boards} />
                    </section>
                </section>
            </section>
        </section>
    )
}