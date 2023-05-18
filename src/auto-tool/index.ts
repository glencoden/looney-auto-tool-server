const dgram = require('dgram')
const server = dgram.createSocket('udp4')

const PORT = 5555

// Buffer map, previously used for comparison with incoming UDP messages

// const UDP_BUFFER: { [key: string]: Uint8Array } = {
//     NOTE_START: Buffer.from('int\x00,i\x00\x00\x00\x00\x00d'),
//     NOTE_END: Buffer.from('int\x00,i\x00\x00\x00\x00\x00@'),
// }

export function bindAutoToolServer(io: any) {
    server.on('error', (err: any) => {
        console.log(`server error:\n${err.stack}`)
        server.close()
    })

    let keydownEvent: Uint8Array[] | null = null
    let keyupEvent: Uint8Array[] | null = null

    server.on('message', (msg: Uint8Array, _rinfo: any) => {
        if (keydownEvent === null) {
            keydownEvent = [ msg ]
        } else if (keydownEvent.length === 1) {
            keydownEvent.push(msg)
        } else if (keydownEvent.length === 2) {
            keydownEvent.push(msg)

            // trigger looney tool next syllable if keydown event message list is complete
            io.emit('next')
        } else if (keyupEvent === null) {
            keyupEvent = [ msg ]
        } else if (keyupEvent.length === 1) {
            keyupEvent.push(msg)
        } else if (keyupEvent.length === 2) {
            keyupEvent.push(msg) // redundant for now, just collect all messages

            // if keydown and keyup note are different, console warn
            if (Buffer.compare(keydownEvent[1], keyupEvent[1]) === 1) {
                console.warn('keydown and keyup note seem to not match')
            }

            keydownEvent = null
            keyupEvent = null
        }
    })

    server.bind(PORT, () => console.log(`Datagram socket listening on port ${PORT}.`))
}
