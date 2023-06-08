import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { socketService, SOCKET_EVENT_ADD_TASK_MSG, SOCKET_EMIT_SET_TASK } from '../../services/socket.service'

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
