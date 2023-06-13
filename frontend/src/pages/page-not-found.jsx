import imgNotFound from '../assets/img/404_error.png'
export function PageNotFound() {
	return (
		<section className="page-not-found">
			<img src={imgNotFound} alt="not found" />
			<h1>We couldn't find the content you were looking for</h1>
			<h2>We track these errors automatically, but if the problem reoccurs please contact us</h2>
		</section>
	)
}
