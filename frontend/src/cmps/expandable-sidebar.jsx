import { useState } from "react";
import { BoardList } from "../cmps/board-list"
import { ICON_EXPAND_ARROW } from "../assets/icons/icons"

export function ExpandableSidebar() {
    const [isHovered, setIsHovered] = useState(false)
    const [isFixed, setIsFixed] = useState(false)

    return (
        <div className="expandable-sidebar-container">
            <div className="expand-btn flex align-center justify-center"
                onClick={() => setIsFixed(!isFixed)}>
                <div className={`arrow ${isFixed ? 'rotate-arrow-left' : 'rotate-arrow-right'}`}>
                    {ICON_EXPAND_ARROW}
                </div>
            </div>
            <section className={`${isFixed ? 'open expandable-sidebar' : 'expandable-sidebar'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}>
                {isFixed || isHovered ?<BoardList fixed={isFixed} /> : ''}
            </section >
        </div>
    )
}