require('dotenv').config();

const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { createStore } = require('./utils');
const resolvers = require('./resolvers');

const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');
const store = createStore();
const isEmail = require('isemail');

const server = new ApolloServer({
  context: async ( { req } ) => {
    //simple auth check on every request
    const auth = req.headers && req.headers.authorization || '';
    const email = Buffer.from(auth, 'base64').toString('ascii');
    if (!isEmail.validate(email)) return { user: null};
    // find a user by their email
    const users = await store.users.findOrCreate({where: {email}});
    const user = users && user[0] || null;

    return { user: { ...user.dataValues }}; // resolver実行時の第3引数のcontextで呼び出せるという認識
  },
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store })
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
