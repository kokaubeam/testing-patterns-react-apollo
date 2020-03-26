import gql from 'graphql-tag'
import { v4 as uuidv4 } from 'uuid'

export default {
  Mutation: {
    addTodo: (_, { text }, { cache }) => {
      const query = gql`
        query GetTodos @client {
          todos {
            id
            text
            completed
          }
        }
      `

      const previous = cache.readQuery({ query })
      const newTodo = {
        id: uuidv4(),
        text,
        completed: false,
        __typename: 'Todo',
      }
      const data = {
        todos: [...previous.todos, newTodo],
      }

      cache.writeQuery({ query, data })
      return newTodo
    },
    toggleTodo: (_root, variables, { cache }) => {
      const id = `Todo:${variables.id}`
      const fragment = gql`
        fragment myTodo on Todo {
          completed
        }
      `
      const todo = cache.readFragment({ fragment, id })
      const data = { ...todo, completed: !todo.completed }
      cache.writeData({ id, data })
      return null
    },
  },
}
