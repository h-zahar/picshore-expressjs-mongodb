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
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await users.insertOne(newUser);
            res.json(result);
          });
    
          app.put('/users', async (req, res) => {
            const newUser = req.body;
            const filter = {email: newUser.email};
            const option = {upsert: true};
    
            const upsertedDoc = {
                $set: newUser
            };
            
            const result = await users.updateOne(filter, upsertedDoc, option);
            res.json(result);
          });
    
          app.put('/users/:email', async (req, res) => {
            const { email } = req.params;
            const filter = { email: email };
            const replacedDoc = {
                $set: { isAdmin: true }
            };
    
            const result = await users.updateOne(filter, replacedDoc);
            res.json(result);
          });
    
          app.get('/users/:email', async (req, res) => {
            const { email } = req.params;
            const query = { email: email };
    
            const matchedUser = await users.findOne(query);
            
            if(matchedUser) {
              res.json(matchedUser);
            }
    
            else {
              res.send({});
            }
    
          });

          app.get('/images', async (req, res) => {
            const query = {};
            // const query = { isApproved: true };
            const cursor = images.find(query);
    
            const images = await cursor.toArray();
            
            if(images) {
              res.json(images);
            }
    
            else {
              res.send([]);
            }
    
          });

          app.get('/images/:email', async (req, res) => {
            const { email } = req.params;
          const query = { email: email };
          
          const cursor = images.find(query);
  
          const images = await cursor.toArray();
  
          if(images) {
            res.json(images);
          }
  
          else {
            res.send([]);
          }
  
        });
  
        app.put('/images', async (req, res) => {
          const updated = req.body;
  
          const filter = { _id: ObjectId(updated._id) };
  
          let updateDoc = {};
          if(updated.isApproved)
          {
           updated.isApproved = false;
           updateDoc = {
               $set: {
                   isApproved: false
               },
           };
          }
  
          else {
              updated.isApproved = true;
              updateDoc = {
                  $set: {
                      isApproved: true
                  },
              };
             }
             const result = await images.updateOne(filter, updateDoc);
  
             if (result) {
              res.json(updated);
             }
        });
  
        app.delete('/images/:id', async (req, res) => {
          const { id } = req.params;
          const query = { _id: ObjectId(id) };
  
          const result = await images.deleteOne(query);
          res.json(result);
        });
  
        app.post('/images', async (req, res) => {
          const newOrder = req.body;
          const result = await images.insertOne(newOrder);
          res.json(result);
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