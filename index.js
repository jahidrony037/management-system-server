const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



// const uri = "mongodb://localhost:27017"
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@atlascluster.k7qynmg.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster`;

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
    //   await client.connect();

    const userCollection = await client.db("userManagementDB").collection("users");

    //user create
    app.post('/user', async(req,res)=>{
        const user = req.body;
        console.log(user);
        const result = await userCollection.insertOne(user);
        res.send(result)
    })

    //get all users
    app.get('/users', async(req,res)=>{
        const cursor = userCollection.find();
        const users = await cursor.toArray();
        res.send(users);
    })

    //delete a user 
    app.delete('/users/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await userCollection.deleteOne(query);
        res.send(result);
    })

    //get a specific user 
    app.get('/users/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {'_id': new ObjectId(id)};
        const result = await userCollection.findOne(query);
        res.send(result);
    })

    //update a user
    app.put('/users/:id', async(req, res)=>{
        const id = req.params.id;
        const user = req.body;
        const query = {'_id': new ObjectId(id)};
      const options = { upsert: true };
      const updateUser = {
        $set: user,
      };
      const result = await userCollection.updateOne(query,updateUser,options);
      //console.log(result);
      res.send(result);
    })




      // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req,res)=>{
    res.send('management server is running !');
})

app.listen(port, ()=>{
    console.log(`management sever port listening on ${port} `);
})