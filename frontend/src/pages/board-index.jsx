import { useEffect, useState } from 'react'
import { SideBar } from '../cmps/side-bar'
import { loadBoards } from '../store/board.actions'

export function BoardIndex() {
    const [boards, setBoards] = useState()
    
    useEffect(() => {
        loadBoards()
    }, [])
    // if (isLoading) return <BoardLoader />

    return (
        <section className="board-index">
            <SideBar />
            {/* <BoardList /> */}
            <section className="board-container">
                {/* <BoardHeader board={board} />
                <GroupList groups={board.groups} /> */}
            </section>
        </section>
    )
}