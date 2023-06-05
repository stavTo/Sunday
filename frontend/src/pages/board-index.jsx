import { useEffect } from 'react'
import { SideBar } from '../cmps/side-bar'
import { loadBoards } from '../store/board.actions'
import { useSelector } from 'react-redux'
import { showErrorMsg } from '../services/event-bus.service'
import { BoardLoader } from '../cmps/BoardLoader'
import { BoardIndexHeader } from '../cmps/boards-index-header'
import { BoardList } from '../cmps/board-list'
import { BoardIndexAside } from '../cmps/BoardIndexAside'
import { ICON_EXPAND_ARROW } from '../assets/icons/icons'

export function BoardIndex() {
	const boards = useSelector(({ boardModule }) => boardModule.boards)
	document.title = 'My Boards'

    useEffect(() => {
        onLoadBoards()
    }, [])

	async function onLoadBoards() {
		try {
			await loadBoards()
		} catch {
			showErrorMsg(`Board could not be loaded`)
		}
	}

	if (!boards) return <BoardLoader />

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
                        <section className="inbox p-1em">
                            <h1 className="fs18 flex row gap-half">
                                <div className="expand-arrow-container">
                                    {ICON_EXPAND_ARROW}
                                </div>Inbox
                                <div className="inbox-indication flex align-center justify-center">
                                    <span>0</span>
                                </div>
                            </h1>
                        </section>
                    </section>
                    <BoardIndexAside />
                </section>
            </section>
        </section>
    )
}
