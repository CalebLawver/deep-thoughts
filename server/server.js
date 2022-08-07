const express = require('express');
// import apolloserver
const { ApolloServer } = require('apollo-server-express');

//import our typedefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

// authorization middleware
const { authMiddleware } = require('./utils/auth');

const PORT = process.env.PORT || 3001;
// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Create a new instance of an apollo server with the GraphQL schema
const startApolloSever = async (typeDefs, resolvers) => {
  await server.start();
  // integrate our Apollo server with the Express application as middleware
  server.applyMiddleware({ app });
  
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
    })
  })
};

// call the async function to start the server
startApolloSever(typeDefs, resolvers);
