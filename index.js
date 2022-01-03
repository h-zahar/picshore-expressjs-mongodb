const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ObjectId } = require('mongodb');


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.a1ern.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const run = async() => {
    try {
        await client.connect();
        const database = client.db(process.env.DB_NAME);
        const users = database.collection(process.env.DB_COLLECTION_USER);
        const images = database.collection(process.env.DB_COLLECTION_IMAGE);

        // Code
        app.get('/users', async (req, res) => {
            // const cursor = users.find({});
            
            // const results = await cursor.toArray();
            // console.log(results);
            // res.send(results);
        });
        
    } finally {
        // await client.close();
    }
};
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server Running Happily...');
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});