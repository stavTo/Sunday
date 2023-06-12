import { useState } from 'react'
import { uploadService } from '../services/upload.service'

export function ImgUploader({ onUploaded = null, onChangeImg }) {
	const [imgData, setImgData] = useState({
		imgUrl: null,
		height: 500,
		width: 500,
	})
	const [isUploading, setIsUploading] = useState(false)

	async function uploadImg(ev) {
		setIsUploading(true)
		const { secure_url, height, width } = await uploadService.uploadImg(ev)
		onChangeImg(secure_url)
		setImgData({ imgUrl: secure_url, width, height })
		setIsUploading(false)
		onUploaded && onUploaded(secure_url)
	}

	function getUploadLabel() {
		if (imgData.imgUrl) return 'Upload Another?'
		return isUploading ? 'Uploading....' : 'Upload Image'
	}

	return (
		<>
			<label className="upload-label" htmlFor="imgUpload"></label>
			<div className="upload-preview">
				{imgData.imgUrl && <img src={imgData.imgUrl} style={{ maxWidth: '200px', float: 'right' }} />}

				<input type="file" onChange={uploadImg} accept="img/*" id="imgUpload" />
			</div>
		</>
	)
}
