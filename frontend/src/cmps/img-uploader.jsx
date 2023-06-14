import { useState } from 'react'
import { uploadService } from '../services/upload.service'

export function ImgUploader({ onUploaded = null, onChangeImg }) {
	const [imgData, setImgData] = useState({
		imgUrl: null,
		height: 500,
		width: 500,
	})

	async function uploadImg(ev) {
		const { secure_url, height, width } = await uploadService.uploadImg(ev)
		onChangeImg(secure_url)
		setImgData({ imgUrl: secure_url, width, height })
		onUploaded && onUploaded(secure_url)
	}

	return (
		<>
			<label className="upload-label" htmlFor="imgUpload"></label>
			<div className="upload-preview">
				{imgData.imgUrl && (
					<img src={imgData.imgUrl} alt="uploaded" style={{ maxWidth: '200px', float: 'right' }} />
				)}

				<input type="file" onChange={uploadImg} accept="img/*" id="imgUpload" />
			</div>
		</>
	)
}
