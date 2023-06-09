const express = require('express');
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

// dbuser= toyWorld
// bdpass=CeDr8OKos5x0igtO



const uri = `mongodb+srv://toyWorld:CeDr8OKos5x0igtO@cluster0.dgcetkk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const categoryItem = client.db('toyWorld').collection('category')

    const categoryDetails = client.db('toyWorld').collection('categoryDetails')

    app.get('/category', async (req, res)=>{
      const category = await categoryItem.find({}).toArray();
      res.send(category);
    })

    app.get('/categoryDetails', async (req, res)=>{
      const category = await categoryDetails.find({}).toArray();
      res.send(category);
    })


    // Send a ping to confirm a successful connection
    await client.db("toyWorld").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");



  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Toy World server is running')
})

app.listen(port, ()=>{
    console.log(`Toy World server is running on ${port}`);
})