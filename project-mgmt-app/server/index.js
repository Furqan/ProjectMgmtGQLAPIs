const express = require('express');
const colors = require('colors');
const cors = require('cors');
require('dotenv').config()

const { graphqlHTTP } = require('express-graphql');

const schema = require('./schema/schema');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;

const app = express();
const router = express.Router();

// Connect to database
connectDB();

app.use(cors());

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: process.env.NODE_ENV === 'development',
}));

// Elastic Beanstalk Health Check
router.get("/", (req, res, next) => {
  res.send('Health Check!!')
})

app.use(router);

app.listen(port, console.log(`Server running on port : ${port}`))