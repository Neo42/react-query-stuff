import React from 'react'
import axios from 'axios'
import {useQuery} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'

function usePokemon() {
  return useQuery(
    'pokemons',
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return axios
        .get(`https://pokeapi.co/api/v2/pokemon`)
        .then((res) => res.data.results)
    },
    {
      cacheTime: 5000, // time before inactive data gets GCed
      staleTime: 0, // time before possible refetch
      refetchOnWindowFocus: true,
    },
  )
}

function Pokemon() {
  const queryInfo = usePokemon()

  return queryInfo.isLoading ? (
    'Loading...'
  ) : queryInfo.isError ? (
    queryInfo.error.message
  ) : (
    <div>
      {queryInfo.data.map((result) => (
        <div key={result.name}>{result.name}</div>
      ))}
      <br />
      {queryInfo.isFetching ? 'Updating...' : null}
    </div>
  )
}
function Berries() {
  const queryInfo = useQuery(
    'berries',
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return axios
        .get(`https://pokeapi.co/api/v2/berry`)
        .then((res) => res.data.results)
    },
    {
      cacheTime: 5000, // time before inactive data gets GCed
      staleTime: 0, // time before possible refetch
      refetchOnWindowFocus: true,
    },
  )

  return queryInfo.isLoading ? (
    'Loading...'
  ) : queryInfo.isError ? (
    queryInfo.error.message
  ) : (
    <div>
      {queryInfo.data.map((result) => (
        <div key={result.name}>{result.name}</div>
      ))}
      <br />
      {queryInfo.isFetching ? 'Updating...' : null}
    </div>
  )
}

function Count() {
  const queryInfo = usePokemon()
  return <h3>You are looking at {queryInfo.data?.length ?? 0} pokemons.</h3>
}

function App() {
  const [show, toggle] = React.useReducer((s) => !s, true)
  return (
    <>
      <button onClick={toggle}> {show ? 'Hide' : 'Show'}</button>
      <br />
      {show ? (
        <>
          <Count />
          <Pokemon />
          <Berries />
        </>
      ) : null}
      <ReactQueryDevtools />
    </>
  )
}
export default App
