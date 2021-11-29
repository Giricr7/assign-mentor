const express = require('express');
const app = express();
require('dotenv').config();
const postroutes = require('./Routes/postroutes');
const getroutes = require('./Routes/getroutes');
const putroutes = require('./Routes/patchroutes');
const mongo = require('./mongo');





loadAPP = async () => {
    
try{
    await mongo.connect();

    app.use(express.json());

    app.use('/', postroutes);
    app.use('/', getroutes);
    app.use('/', putroutes);
    


    app.listen(process.env.PORT, (req, res) => {
    
        console.log('server connected successfully');

    })
} catch (err) {
    console.error(err);
}


}

loadAPP();