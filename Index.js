const express = require("express");
const cors = require("cors");
const port = process.env.PROT || 5000;
const app = express();
// !                password:TJJvX39OGmgvUHxN
// !                password:Assinment_Ten

app.use(cors());
app.use(express.json());

// ! Mongodb File

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://Assinment_Ten:TJJvX39OGmgvUHxN@cluster0.frskr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const reviewCollection = client.db("reviewDB").collection("review");
    const userCollection = client.db("userDB").collection("user");

    app.post("/addUser", async (req, res) => {
      const newReview = req.body;
      console.log(newReview);
      const resutl = await reviewCollection.insertOne(newReview);
      res.send(resutl);
    });

    app.get("/reviews", async (req, res) => {
      const cursor = reviewCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const qurey = { _id: new ObjectId(id) };
      const result = await reviewCollection.findOne(qurey);
      res.send(result);
    });

    // user Details 
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      console.log("Creatin user Succecfully ", newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get reviews for the logged-in user
    app.get("/myReviews", async (req, res) => {
      const userEmail = req.query.email; // Email sent as query parameter
      if (!userEmail) {
        return res.status(400).send({ error: "User email is required" });
      }
      const query = { user_email: userEmail };
      const result = await reviewCollection.find(query).toArray();
      res.send(result);
    });

    // Specific User GET
    app.get("/myReviews/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new ObjectId(id) };
      const result = await reviewCollection.findOne(qurey);
      res.send(result);
    });

    app.put("/myReviews/:id",async(req, res) =>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updatedReviews = req.body
      const reviews = {
        $set:{
          coverimage: updatedReviews.coverimage,
          description: updatedReviews.description,
          gameRating: updatedReviews.gameRating,
          gameTitle: updatedReviews.gameTitle,
          publishingyear: updatedReviews.publishingyear,
        }
      }
      const result = await reviewCollection.updateOne(filter, reviews ,options)
      res.send(result)

    })




    
    // Specific Deleted 
    app.delete("/myReviews/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new ObjectId(id) };
      const result = await reviewCollection.deleteOne(qurey);
      res.send(result);
    });
// find api code
app.get("/highestRatedGames", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6; // সর্বোচ্চ কতগুলো গেম দেখাবে, ডিফল্ট ৬
    const result = await reviewCollection
      .find()
      .sort({ gameRating: -1 }) // `gameRating` অনুযায়ী সাজানো (DESC)
      .limit(limit) // সীমাবদ্ধ সংখ্যা
      .toArray();
    res.send(result);
  } catch (error) {
    console.error("Failed to fetch highest rated games:", error);
    res.status(500).send({ error: "Failed to fetch highest rated games" });
  }
});

    // app.delete('/myReviews/:id', async(req, res)=>{
    //   const id = req.params.id;
    //   console.log(id);
    //   const query = {_id: new ObjectId(id)}
    //   const result = await reviewCollection.deleteOne(query)
    //   res.send(result)
    // })

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Assinment Ten is Running");
});

app.listen(port, () => {
  console.log(`Server Is Running Is Prot ${port}`);
});



