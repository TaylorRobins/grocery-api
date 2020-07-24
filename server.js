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

app.get("/api/products/:id", (request, response) => {
  const productId = Number(request.params.id);

  const product = products.find((p) => {
    if (productId === p.id) {
      return true;
    }
  });

  if (!product) {
    response.send(`Product with id ${productId} not found!`);
    return;
  }

  response.send(product);
});

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

app.put("/api/products/:id", (request, response) => {
  const productId = Number(request.params.id);

  const product = products.find((p) => {
    return productId === p.id;
  });

  if (!product) {
    response.send(`Product with id ${productId} not found!`);
    return;
  }

  const body = request.body;

  if (body.name) {
    product.name = body.name;
  }

  if (body.price) {
    product.price = body.price;
  }

  const jsonPayload = {
    products: products,
  };
  fs.writeFileSync("products.json", JSON.stringify(jsonPayload));

  response.send();
});

app.delete("/api/products/:id", (request, response) => {
  const productId = Number(request.params.id);

  const productIndex = products.findIndex((p) => {
    return productId === p.id;
  });

  if (productIndex === -1) {
    response.send(`Product with id ${productId} not found!`);
    return;
  }

  products.splice(productIndex, 1);

  const jsonPayload = {
    products: products,
  };

  fs.writeFileSync("products.json", JSON.stringify(jsonPayload));
  response.send();
});

const port = process.env.PORT ? process.env.PORT : 3000;
app.listen(port, () => {
  console.log("Grocery API Server Started");
});
