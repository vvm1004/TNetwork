import { server } from './src/socket/socket.js'

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server listening on ${PORT}`))