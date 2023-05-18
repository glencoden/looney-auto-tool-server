import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import { bindAutoToolServer } from './auto-tool'

const PORT = 5555

const app = express()

app.use(cors())

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}.`))

const io = new Server(server, {
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ],
        },
    },
)

io.on('connection', (
    // socket
) => {
    console.log('a user connected')
})

bindAutoToolServer(io)