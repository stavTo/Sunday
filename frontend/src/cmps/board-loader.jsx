import loader from '../assets/img/board-loader.gif'

export function BoardLoader() {
	return (
		//TODO ADD LOADING SIDEBAR
		<section className="board-loader">
			<img src={loader} alt="loading animation" />
		</section>
	)
}
