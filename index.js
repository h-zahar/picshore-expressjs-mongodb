const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const run = async() => {
    try {

    } finally {
        
    }
};
run().catch(console.dir);


app.get('/', (req, res) => {
    req.send('Server Running Happily...');
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});