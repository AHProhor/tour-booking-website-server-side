const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nbt3a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect()
        const database = client.db('foding_travel');
        const tourCollection = database.collection('tours');


        // Get Tours API
        app.get('/tours', async(req,res) =>{
            const cursor = tourCollection.find({});
            const tours = await cursor.toArray();
            res.send(tours);
        });

        // POST API
        app.post('/tours', async (req, res) =>{
            const tour = req.body
            const result = await tourCollection.insertOne(tour);
            res.json(result);
        });
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Assignment 11 server is running')
});

app.listen(port,()=>{
    console.log('assignment11 is running on port :',port);
})

