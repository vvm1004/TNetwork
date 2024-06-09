'use strict'
import dotenv from "dotenv"
dotenv.config()

//level 0
// const config = {
//     app: {
//         port: 3000
//     },
//     db: {
//         host: 'localhost',
//         port: 27017,
//         name: 'shopDEV'
//     }
// }

//level 1
const config = {
    dev: {
        app: {
            port: process.env.DEV_APP_PORT || 5000
        },
        db: {
            host: process.env.DEV_DB_HOST || 'localhost',
            port: process.env.DEV_DB_PORT || 27017,
            name: process.env.DEV_DB_NAME || 'socialApp'
        }
    },
    pro: {
        app: {
            port: process.env.PRO_APP_PORT || 5000
        },
        db: {
            host: process.env.PRO_DB_HOST || 'localhost',
            port: process.env.PRO_DB_PORT || 27017,
            name: process.env.PRO_DB_NAME || 'socialAppPro'
        }
    }
};

export default config;