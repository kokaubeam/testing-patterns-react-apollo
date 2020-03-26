import React from 'react'
import { act, fireEvent, render, wait } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { bool, build, fake } from '@jackfranklin/test-data-bot'
import resolvers from './apollo/resolvers'

import App, { GET_TODOS, ADD_TODO } from './App'

const TodoBuilder = build('Todo', {
  fields: {
    id: fake(faker => faker.random.uuid()),
    text: fake(faker => faker.lorem.sentence()),
    completed: bool(),
    __typename: 'Todo',
  },
})

test('renders todos', async () => {
  const mockTodos = [TodoBuilder(), TodoBuilder(), TodoBuilder()]

  const mocks = [
    {
      request: {
        query: GET_TODOS,
      },
      result: {
        data: {
          todos: mockTodos,
        },
      },
    },
  ]

  const { getByText } = render(
    <MockedProvider mocks={mocks} resolvers={resolvers}>
      <App />
    </MockedProvider>,
  )

  getByText(/loading/i)

  await wait()

  mockTodos.forEach(todo => getByText(todo.text))
})

test.skip('adds a todo', async () => {
  const mockTodos = [TodoBuilder(), TodoBuilder(), TodoBuilder()]
  const mockNewTodo = TodoBuilder()

  const mocks = [
    {
      request: {
        query: GET_TODOS,
      },
      result: {
        data: {
          todos: mockTodos,
        },
      },
    },
    {
      request: {
        query: ADD_TODO,
        variables: {
          text: mockNewTodo.text,
        },
      },
      result: {
        data: {
          todos: [...mockTodos, mockNewTodo],
        },
      },
    },
  ]

  const { getByTestId, getByText } = render(
    <MockedProvider mocks={mocks} resolvers={resolvers}>
      <App />
    </MockedProvider>,
  )

  await wait()

  await act(async () => {
    fireEvent.change(getByTestId('todo input'), {
      target: { value: mockNewTodo.text },
    })

    fireEvent.click(getByText(/add/i))

    await wait()
  })

  mockTodos.forEach(todo => getByText(todo.text))
  getByText(mockNewTodo.text)
})
