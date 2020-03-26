import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import resolvers from './resolvers'
import { v4 as uuidv4 } from 'uuid'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  resolvers,
})

client.cache.writeData({
  data: {
    todos: [
      {
        id: uuidv4(),
        text: 'Eat a sandwich 🥪',
        completed: false,
        __typename: 'Todo',
      },
      {
        id: uuidv4(),
        text: 'Save the 📣👩, save the 🌎',
        completed: false,
        __typename: 'Todo',
      },
      {
        id: uuidv4(),
        text: 'Panic buy more 🧃s',
        completed: true,
        __typename: 'Todo',
      },
    ],
  },
})

export default client
