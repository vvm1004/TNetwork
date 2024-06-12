'use strict'

import mongoose from 'mongoose'
import config from '../configs/config.mongodb.js';
import { countConnect } from '../helpers/check.connect.js';

const env = process.env.NODE_ENV || 'dev'
const { host, name, port } = config[env].db;
const connectString = `mongodb://${host}:${port}/${name}`;

console.log('connecString: ', connectString)
class Database {
    constructor() {
        this.connect()
    }

    //connect
    connect(type = 'mongodb') {
        if(process.env.NODE_ENV === "dev"){
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
        
        }
        mongoose.connect(connectString,{
            maxPoolSize: 50
        })
            .then(_ => console.log(`Connect Mongodb Success PRO`, countConnect()))
            .catch(err => console.log(`Error Connect!`))
    }

    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance

export default instanceMongodb;
