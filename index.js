const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

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
        const orderCollection = database.collection('orders');


        // Get Tours API
        app.get('/tours', async(req,res) =>{
            const cursor = tourCollection.find({});
            const tours = await cursor.toArray();
            res.send(tours);
        });

        // Get Order Api
        app.get('/orders', async(req,res) =>{
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // Get Single Booking
        app.get('/tours/:id',async(req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const tour = await tourCollection.findOne(query);
            res.json(tour);
        })

        // POST API for add tour
        app.post('/tours', async (req, res) =>{
            const tour = req.body
            const result = await tourCollection.insertOne(tour);
            res.json(result);
        });
        // Post API for add orders
        app.post('/orders', async (req, res) =>{
            const order = req.body
            const result = await orderCollection.insertOne(order);
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

