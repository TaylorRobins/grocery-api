const { query } = require("express");

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const url = process.env.MONGODB_URL;
const databaseName = process.env.MONGODB_DATABASE;

const collectionName = "products";
const settings = {
  useUnifiedTopology: true,
};

let databaseClient;
let productCollection;

//connect to database

const connect = function () {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, settings, (error, client) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      databaseClient = client.db(databaseName);
      productCollection = databaseClient.collection(collectionName);
      console.log("SUCCESSFULLY CONNECTED TO DATABASE!");
      resolve();
    });
  });
};

//INSERT ONE DOCUMENT
//insert()
const insertOne = function (product) {
  return new Promise((resolve, reject) => {
    productCollection.insertOne(product, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      console.log("SUCCESSFULLY INSERTED A NEW DOCUMENT");
      resolve();
    });
  });
};

//FIND ALL DOCUMENTS
//findAll()

const findAll = function () {
  const query = {};

  return new Promise((resolve, reject) => {
    productCollection.find(query).toArray((error, documents) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      console.log(`SUCCESSFULLY FOUND ${documents.length} DOCUMENTS`);
      resolve(documents);
    });
  });
};

//FIND ONE DOCUMENT
//find()

const findOne = function (query) {
  return new Promise((resolve, reject) => {
    productCollection.find(query).toArray((error, documents) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      if (documents.length > 0) {
        console.log("SUCCESSFULLY FOUND DOCUMENT!");
        const document = documents[0];
        resolve(document);
      } else {
        reject("No document found!");
      }
    });
  });
};
//UPDATE ONE DOCUMENT
//updateOne()
const updateOne = function (query, newProduct) {
  const newProductQuery = {};

  if (newProduct.name) {
    newProductQuery.name = newProduct.name;
  }

  if (newProduct.price) {
    newProductQuery.price = newProduct.price;
  }

  if (newProduct.category) {
    newProductQuery.category = newProduct.category;
  }

  return new Promise((resolve, reject) => {
    productCollection.updateOne(
      query,
      { $set: newProductQuery },
      (error, result) => {
        if (error) {
          console.log(error);
          reject(error);
          return;
        } else if (result.modifiedCount === 0) {
          console.log("No Document Found");
          reject("No Document Found");
          return;
        }
        console.log("SUCCESSFULLY UPDATED DOCUMENT!");
        resolve();
      }
    );
  });
};

//DELETE ONE DOCUMENT
//deleteOne()

const deleteOne = function (query) {
  return new Promise((resolve, reject) => {
    productCollection.deleteOne(query, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      } else if (result.deletedCount === 0) {
        console.log("No Document Found");
        reject("No Document Found");
        return;
      }
      console.log("SUCCESSFULLY DELETED DOCUMENT!");
      resolve();
    });
  });
};

// Make all functions available to other javascript files
// CommonJS Export
module.exports = { connect, insertOne, findAll, findOne, updateOne, deleteOne };

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// TESTS

/*(async () => {
  // run `node dataAccessLayer.js`
  await connect();

  /*const products = await findAll();
  console.log(products);*/
/* const productQuery = {
    _id: new ObjectId("5f20e134374f7b0500fa9327"),
  };
  const product = await findOne(productQuery);
  console.log(product);*/
/*const productQuery = {
    _id: new ObjectId("5f20e134374f7b0500fa9327"),
  };
  const newProduct = {
    name: "Crunchy Peanut Butter",
    price: 99.99,
  };
  await updateOne(productQuery, newProduct);*/

//const productQuery = {
// _id: new ObjectId("5f20e134374f7b0500fa9327"),
// };
// await deleteOne(productQuery);

// console.log("END");
//process.exit(0);
//})();
