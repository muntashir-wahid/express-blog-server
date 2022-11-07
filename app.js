const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER, process.env.DB_PASSWORD);

// MongoDB configure

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hjjckmu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const blogCollection = client.db("expressBlog").collection("blogs");

    // Create a post
    app.post("/api/v1/blogs", async (req, res) => {
      const body = req.body;

      const result = await blogCollection.insertOne(body);

      const blog = Object.assign(body, { _id: result.insertedId });

      res.status(201).json({
        status: "success",
        data: {
          blog,
        },
      });
    });

    // Read an user's post
    app.get("/api/v1/blogs/q", async (req, res) => {
      const authorEmail = req.query.email;
      const query = { authorEmail };

      const cursor = blogCollection.find(query);
      const blogs = await cursor.toArray();

      res.status(200).json({
        status: "success",
        data: {
          blogs,
        },
      });
    });

    // Read all blogs

    app.get("/api/v1/blogs", async (req, res) => {
      const cursor = blogCollection.find({});
      const blogs = await cursor.toArray();

      res.status(200).json({
        status: "success",
        data: {
          blogs,
        },
      });
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.status(200).json({
    staus: "success",
    message: "Hello from Express blog server",
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Express blod server is listening on port ${port}`);
});
