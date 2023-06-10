import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ICON_CLOSE, ICON_HOUSE } from '../../assets/icons/icons'
import { ActivityList } from './activity-list'

export function ActivityDetails() {
	const navigate = useNavigate()
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)

	function onCloseModal() {
		navigate(`/boards/${board._id}`)
	}

	return (
		<>
			<div className="details-back-panel"></div>
			<section className="activity-details default-scroll">
				<div className="header-wrapper">
					<span className="close-modal-btn" onClick={onCloseModal}>
						{ICON_CLOSE}
					</span>
					<div className="activity-details-title">
						<span>Moovit log</span>
					</div>
					<div>
						<ul className="clean-list flex board-nav-bar">
							<li className="active">
								<div className="btn-primary">
									<span href="#">{ICON_HOUSE} Activity</span>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div className="activity-list-container">
					<ActivityList board={board} />
				</div>
			</section>
		</>
	)
}
