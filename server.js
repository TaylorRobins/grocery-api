const express = require("express");
const bodyParser = require("body-parser");
const dataAccessLayer = require("./dataAcessLayer");
const { request } = require("http");
const { response } = require("express");
const { ObjectId } = require("mongodb");
dataAccessLayer.connect();

const app = express();

app.use(bodyParser.json());

let products = [];

try {
  products = JSON.parse(fs.readFileSync("products.json")).products;
} catch (error) {
  console.log("No existing file.");
}

app.get("/api/products/:id", async (request, response) => {
  const productId = request.params.id;

  const productQuery = {
    _id: new ObjectId(productId),
  };
  let product;
  try {
    product = await dataAccessLayer.findOne(productQuery);
  } catch (error) {
    response.send(`Product with id ${productId} not found!`);
    return;
  }

  response.send(product);
});

app.get("/api/products", async (request, response) => {
  const products = await dataAccessLayer.findAll();

  response.send(products);
});

app.post("/api/products", async (request, response) => {
  const body = request.body;

  if (!body.name || !body.price || !body.category) {
    response.send(
      "Bad Request. Validation Error. Missing name, price, or category!"
    );
    return;
  }

  await dataAccessLayer.insertOne(body);

  response.send();
});

app.put("/api/products/:id", async (request, response) => {
  const productId = request.params.id;
  const body = request.body;
  const productQuery = {
    _id: new ObjectId(productId),
  };
  await dataAccessLayer.updateOne(productQuery, body);

  response.send();
});

app.delete("/api/products/:id", async (request, response) => {
  const productId = request.params.id;

  const productQuery = {
    _id: new ObjectId(productId),
  };
  await dataAccessLayer.deleteOne(productQuery);

  response.send();
});

const port = process.env.PORT ? process.env.PORT : 3000;
app.listen(port, () => {
  console.log("Grocery API Server Started");
});
