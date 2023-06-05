import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export function ReactQuillWrapper({ setCommentToEdit }) {
	const [text, setText] = useState('')

	function handleChange(value) {
		setText(value)
		setCommentToEdit(value)
	}

	const modules = {
		toolbar: [
			[{ header: [1, 2, false] }],
			['bold', 'italic', 'underline', 'strike'],
			[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
			['link', 'image'],
		],
	}

	const formats = [
		'header',
		'bold',
		'italic',
		'underline',
		'strike',
		'blockquote',
		'list',
		'bullet',
		'indent',
		'link',
		'image',
	]

	return (
		<div className="quill-wrapper">
			<ReactQuill value={text} modules={modules} formats={formats} onChange={handleChange} />
		</div>
	)
}
