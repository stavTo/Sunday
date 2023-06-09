import { FILTER_PERSON } from "../../assets/icons/icons"
import { TippyContainer } from '../tippy-container'

export function ActivityFilter() {

    return (
        <div className="filter-activity flex align-center justify-start gap-1">
            <div className="input-container flex align-center">
                <input type="search" placeholder="Filter by name"></input>
            </div>
                <div className="filter-person btn-primary flex align-center gap-half">
                    {FILTER_PERSON}
                    <span>Person</span>
                </div>
        </div>
    )
}