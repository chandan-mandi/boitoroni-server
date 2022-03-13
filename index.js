const express = require('express');
const {MongoClient} = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.islim.mongodb.net/water-kingdom?retryWrites=true&w=majority`;
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
        // GET SINGLE BOOK DATA
        app.get('/books/:id', async(req,res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bookCollection.findOne(query)
            res.json(result)
        })
        // UPDATE SINGLE BOOK DATA 
        app.put('/books/update/:id', async(req,res) => {
            const id = req.params.id;
            const updatedBook = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    book_name: updatedBook.book_name,
                    author: updatedBook.author,
                    publisher: updatedBook.publisher,
                    pages: updatedBook.pages,
                    authordetails: updatedBook.authordetails,
                    language: updatedBook.language,
                    price: updatedBook.price,
                    thumbnail: updatedBook.thumbnail,
                    book_description: updatedBook.book_description
                },
            };
            const result = await bookCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })
        // DELETE SINGLE BOOK DATA 
        app.delete('/books/delete/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await bookCollection.deleteOne(query);
            res.json(result)
        })
        // ADD A BOOK DATA
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