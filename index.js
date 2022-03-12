const express = require('express');
const {MongoClient} = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9pclo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('Database Connected');  
        const database = client.db('boitoroni'); 
        const bookCollection = database.collection('books')

        // GET BOOKS API
        app.get('/books', async(req, res) => {
            const result = await bookCollection.find({}).toArray();
            res.json(result)
        })
        app.post('/addbook', async(req, res) => {
            const bookdata = req.body;
            console.log(bookdata);
            const result = await bookCollection.insertOne(bookdata);
            res.json(result);
        });
    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Congratulations! Your Server is Running")
})

app.listen(port, () => {
    console.log('Running this server on PORT', port);
})