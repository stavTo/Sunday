



export function GroupPreview({ group }) {



    return (
        <article className="group-preview">
            <div>{group.tasks.length}</div>
            <div> <h4>{group.title}</h4> </div>
            <div> <button>Collapse group</button>  </div>

            <TaskList tasks={group.tasks} />


        </article>
    )
}