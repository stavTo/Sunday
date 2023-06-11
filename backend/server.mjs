import http from 'http'
import path from 'path'
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'
// import { config } from "dotenv"
// import readline from "readline"

// config()

// const openai = new OpenAIApi(new Configuration({
//     apiKey: process.env.API_KEY
// }))

// const userInterface = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// })
// const gptAnswers = []

// userInterface.prompt()
// userInterface.on("line", async input => {
//     const res = await openai.createChatCompletion({
//         model: "gpt-3.5-turbo",
//         max_tokens: 300,
//         temperature: 0.3,
//         messages: [{ "role": "system", "content": "You are an AI assistant helping with the creation of project management templates for a project management app. Please provide in your response ONLY an object that includes the board name, groups, and tasks based on the given user input. the tasks and the division of groups must be realted to the subject of the theme that the user has entered. You MUST not reply in any other way that is not according to the following format: {boardName: 'Board Name', groups: [{groupName: Group Name, tasks: [Task description1, Task description2, Task description3]}]" },]
//     })
//     console.log(res.data.choices[0].message.content)
//     gptAnswers.push(res.data.choices[0].message.content)
// })

// console.log("gptAnswers", gptAnswers)

const app = express()
const server = http.createServer(app)

// Express App Config
app.use(cookieParser())
app.use(express.json())


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('public')))
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:3000',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'http://localhost:5173'
        ],
        credentials: true
    }
    app.use(cors(corsOptions))
}

import { userRoutes } from './api/user/user.routes.mjs'
import { boardRoutes } from './api/board/board.routes.mjs'
import { setupSocketAPI } from './services/socket.service.mjs'
// import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.mjs'

// routes
// app.all('*', setupAsyncLocalStorage)

app.use('/api/user', userRoutes)
app.use('/api/board', boardRoutes)
setupSocketAPI(server)

// Make every server-side-route to match the index.html
// so when requesting http://localhost:3030/index.html/board/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue/react-router to take it from there
app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})


import { logger } from './services/logger.service.mjs'
import { Configuration, OpenAIApi } from 'openai'
const port = process.env.PORT || 3030
server.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})