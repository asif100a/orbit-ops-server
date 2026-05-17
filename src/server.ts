import {Server} from 'http'
import mongoose from 'mongoose'

import 'colors'
import { envConfig } from './app/config/env';
import app from './app';

let server: Server;
const port = envConfig.PORT;

const startServer = async() => {
    try {
        await mongoose.connect(envConfig.DB_URL)
        console.log('Server has started successfully'.america.bold);

        server = app.listen(port, () => {
            console.log(`Server is listening on http://localhost:${port}`.green.italic)
        })
    } catch (error) {
        console.error('❌ Error to start the server: '.red.bold, error);
    }
}

(async() => {
    await startServer()
})();


// ---------------Errors---------------
process.on('SIGTERM', (err) => {
    console.error('❌ Sigterm Signal Error: ', err)

    if(server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on('SIGINT', () => {
    console.error('❌ SigInt Error')

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection Error: ', err)

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception Error: ', err)

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})