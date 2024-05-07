'use strict'


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
            port: process.env.DEV_APP_PORT || 3052
        },
        db: {
            host: process.env.DEV_DB_HOST || 'localhost',
            port: process.env.DEV_DB_PORT || 27017,
            name: process.env.DEV_DB_NAME || 'Threads'
        }
    },
    pro: {
        app: {
            port: process.env.PRO_APP_PORT || 3000
        },
        db: {
            host: process.env.PRO_DB_HOST || 'localhost',
            port: process.env.PRO_DB_PORT || 27017,
            name: process.env.PRO_DB_NAME || 'shopPRO'
        }
    }
};

export default config;