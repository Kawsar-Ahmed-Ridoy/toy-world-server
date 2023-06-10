const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dgcetkk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

async function run() {
  try {

    const categoryItem = client.db("toyWorld").collection("category");

    const categoryDetails = client.db("toyWorld").collection("categoryDetails");

    const addAToy = client.db("toyWorld").collection("addAToy");

    app.get("/addAToy", async (req, res) => {
      const allToys = await addAToy.find({}).toArray();
      res.send(allToys);
    });

    app.get("/myToys", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await addAToy.find(query).toArray();
      res.send(result);
    });

    app.get("/category", async (req, res) => {
      const category = await categoryItem.find({}).toArray();
      res.send(category);
    });

    app.get("/categoryDetails", async (req, res) => {
      const category = await categoryDetails.find({}).toArray();
      res.send(category);
    });

    app.get("/myToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await addAToy.findOne(query);
      res.send(user);
    });

    app.post("/addAToy", async (req, res) => {
      const singleToy = req.body;
      const result = await addAToy.insertOne(singleToy);
      res.send(result);
    });

    app.put("/myToys/:id", async (req, res) => {
      const id = req.params.id;
      const update = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedToys = {
        $set: {
          price: update.price,
          quantity: update.quantity,
          description: update.description
        }
      };
      const result = await addAToy.updateOne(filter, updatedToys, options);
      res.send(result);
    });

    app.delete("/myToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addAToy.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("toyWorld").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Toy World server is running");
});

app.listen(port, () => {
  console.log(`Toy World server is running on ${port}`);
});
