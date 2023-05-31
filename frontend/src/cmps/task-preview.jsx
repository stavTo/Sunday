export function TaskPreview(task) {
    
    return (
        <ul className="task-preview">
            {Object.keys(task)}
        </ul>
    )
}