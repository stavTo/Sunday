
import { GroupPreview } from "./group-preview";

export function GroupList({ groups }) {


    if (!groups) return <h1>Loading...</h1>
    return (
        <section className="group-list">

            <ul className="">
                {
                    groups.map(group =>
                        <li key={group.id}  >
                            <GroupPreview group={group} />
                        </li>)
                }
            </ul>

            <button>Add new group</button>
        </section>
    )
}