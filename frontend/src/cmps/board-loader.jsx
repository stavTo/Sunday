import loader from '../assets/img/board-loader.gif'
export function BoardLoader() {
	return (
		<section className="board-loader">
			<div className="sidebar-loader"></div>
			<div className="main-loader-container">
				<div className="img-container">
					<img src={loader} alt="loading animation" />
				</div>
			</div>
		</section>
	)
}
