import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import './App.css'

export const GET_TODOS = gql`
  query GetTodos @client {
    todos {
      id
      text
      completed
    }
  }
`

export const ADD_TODO = gql`
  mutation AddTodo($text: String!) {
    addTodo(text: $text) @client
  }
`

export const TOGGLE_TODO = gql`
  mutation ToggleTodo($id: Int!) {
    toggleTodo(id: $id) @client
  }
`

function App() {
  const { loading, data } = useQuery(GET_TODOS)

  const [addTodo] = useMutation(ADD_TODO)
  const [toggleTodo] = useMutation(TOGGLE_TODO)

  const [addTodoValue, setAddTodoValue] = useState('')

  if (loading) {
    return (
      <div>
        <span role='img' aria-label='Rocket Ship'>
          🚀
        </span>
        Loading...
      </div>
    )
  }

  const todos = data?.todos ?? []

  return (
    <div className='App'>
      <h1>Todos</h1>

      <div>
        <form
          onSubmit={e => {
            e.preventDefault()

            if (!addTodoValue) return

            addTodo({ variables: { text: addTodoValue } })
            setAddTodoValue('')
          }}
        >
          <input
            data-testid='todo input'
            name='text'
            type='text'
            onChange={event => setAddTodoValue(event.target.value)}
            value={addTodoValue}
          />
          <button type='submit'>Add</button>
        </form>
      </div>

      <ul className='todos'>
        {todos.map(({ id, text, completed }) => (
          <li
            key={id}
            onClick={() => toggleTodo({ variables: { id } })}
            style={{
              cursor: 'pointer',
              userSelect: 'none',
              textDecoration: completed ? 'line-through' : 'none',
            }}
          >
            {text}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
