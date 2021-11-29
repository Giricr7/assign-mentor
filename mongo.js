const { MongoClient } = require('mongodb');


//connecting to mongodb
const mongo = {
    
    db: null,
    connect:async function(){
        try {
            
            const client = new MongoClient(process.env.MONGO_URL);

            await client.connect();
            console.log('db connected successfully');

            this.db = await client.db(process.env.MONGO_NAME);
            console.log('selected DB is - ',process.env.MONGO_NAME)

        } catch(err) {
            console.error(err);
        }
    }



}


module.exports = mongo;