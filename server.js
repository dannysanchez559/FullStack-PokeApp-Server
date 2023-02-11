// DOTENV
require('dotenv').config({ path: './.env' });
const baseImgUrl = process.env.BASE_IMAGE_URL; // Home pokemon selection
const mongoUrl = process.env.MONGO_DB_URL;

// EXPRESS & MONGOOSE
const express = require('express');
const app = express();
const mongoose = require('mongoose');

// GRAPHQL
const graphql = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
const TopCardModel = require('./models/TopCard');

// OTHER
const cors = require('cors');

// MIDDLEWARES
app.use(cors()); // avoids cors errors
app.use(express.json());

// GRAPHQL SCHEMAS
const BaseCardType = new GraphQLObjectType({
  name: 'BaseCard',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLInt) },
    url: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const TopCardType = new GraphQLObjectType({
  name: 'TopCard',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLInt) },
    url: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});
// GRAPHQL QUERIES
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getAllCards: {
      type: new GraphQLList(BaseCardType),
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        return cardData;
      },
    },
    getTopCards: {
      type: new GraphQLList(TopCardType),
      args: { id: { type: GraphQLInt } },
      async resolve(parent, args) {
        return await TopCardModel.find({});
      },
    },
  },
});

const schema = new GraphQLSchema({ query: RootQuery });
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true, // enables GUI
  })
);

const cardData = [
  {
    _id: 1,
    url: baseImgUrl + '15.png',
  },
  {
    _id: 2,
    url: baseImgUrl + '12.png',
  },
  {
    _id: 3,
    url: baseImgUrl + '164.png',
  },
  {
    _id: 4,
    url: baseImgUrl + '50.png',
  },
  {
    _id: 5,
    url: baseImgUrl + '62.png',
  },
  {
    _id: 6,
    url: baseImgUrl + '109.png',
  },
  {
    _id: 7,
    url: baseImgUrl + '114.png',
  },
  {
    _id: 8,
    url: baseImgUrl + '63.png',
  },
  {
    _id: 9,
    url: baseImgUrl + '48.png',
  },
  {
    _id: 10,
    url: baseImgUrl + '18.png',
  },
  {
    _id: 11,
    url: baseImgUrl + '13.png',
  },
  {
    _id: 12,
    url: baseImgUrl + '6.png',
  },
  {
    _id: 13,
    url: baseImgUrl + '32.png',
  },
  {
    _id: 14,
    url: baseImgUrl + '35.png',
  },
  {
    _id: 15,
    url: baseImgUrl + '45.png',
  },
  {
    _id: 16,
    url: baseImgUrl + '55.png',
  },
  {
    _id: 17,
    url: baseImgUrl + '85.png',
  },
  {
    _id: 18,
    url: baseImgUrl + '91.png',
  },
  {
    _id: 19,
    url: baseImgUrl + '96.png',
  },
  {
    _id: 20,
    url: baseImgUrl + '98.png',
  },
];

mongoose.connect(mongoUrl);

// root - catalog of pokemon to choose from
app.get('/', (req, res) => {
  res.json({
    posts: cardData,
  });
});

// toplist route GET Method
app.get('/toplist', (req, res) => {
  TopCardModel.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

// create list route
app.post('/createlist', async (req, res) => {
  const card = req.body;
  const newCard = new TopCardModel(card);

  await newCard.save();
  res.json(card);
});

// delete from list route
app.post('/delete', async (req, res) => {
  const cardId = req.body._id;
  TopCardModel.deleteOne({ _id: cardId }, (err) => {
    if (err) {
      res.send(err);
    } else {
      console.log('deleted successfully!');
    }
  });
});

// update card name from toplist
app.post('/updatecard', (req, res) => {
  const cardId = req.body._id;
  const cardName = req.body.cardName;
  const cardAge = req.body.cardAge;
  console.log('age in server: ', req.body);

  TopCardModel.updateOne(
    { _id: cardId },
    { name: cardName, age: cardAge },
    (err) => {
      if (err) {
        res.send(err);
      } else {
        console.log('updated card successfully!');
      }
    }
  );
});

app.listen(3001, () => {
  console.log('server started on port 3001');
});
