const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://toyWorld:CeDr8OKos5x0igtO@cluster0.dgcetkk.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const categoryItem = client.db("toyWorld").collection("category");

    const categoryDetails = client.db("toyWorld").collection("categoryDetails");

    const addAToy = client.db("toyWorld").collection("addAToy");

    app.post("/addAToy", async (req, res) => {
      const singleToy = req.body;
      const result = await addAToy.insertOne(singleToy);
      res.send(result);
    });

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
      }
      const result = await addAToy.updateOne(filter, updatedToys, options);
      res.send(result)
    });

    app.delete("/myToys/:id", async (req, res) => {
      const id = req.params.id;
      console.log("delete ", id);
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
