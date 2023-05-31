export function BoardHeader({ board }) {
	return (
		<section className="board-header">
			<section className="board-header-top">
				<h1 className="board-name title-font">{board.title}</h1>
			</section>
		</section>
	)
}
