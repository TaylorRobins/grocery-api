const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { request } = require("http");
const { response } = require("express");

const app = express();

app.use(bodyParser.json());

let products = [];

try {
  products = JSON.parse(fs.readFileSync("products.json")).products;
} catch (error) {
  console.log("No existing file.");
}

app.get("/api/products", (request, response) => {
  response.send(products);
});

app.post("/api/products", (request, response) => {
  const body = request.body;

  if (!body.id || !body.name || !body.price) {
    response.send("Bad Request. Validation Error. Missing id, name, or price.");
    return;
  }
  products.push(body);
  const jsonPayload = {
    products: products,
  };
  fs.writeFileSync("products.json", JSON.stringify(jsonPayload));

  response.send();
});

app.listen(3000, () => {
  console.log("Grocery API Server Started");
});
