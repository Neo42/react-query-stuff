import React from 'react'
import axios from 'axios'
import {useQuery} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'

function App() {
  // const [value, setValue] = React.useState('')
  // const pokemon = useDebouncedState(value, 500)
  const [pokemon, setPokemon] = React.useState('')
  return (
    <>
      <input
        type="text"
        // value={value}
        value={pokemon}
        onChange={(e) => setPokemon(e.target.value)}
      />
      <PokemonSearch pokemon={pokemon} />
      <ReactQueryDevtools />
    </>
  )
}

function PokemonSearch({pokemon}) {
  const queryInfo = usePokemon(pokemon)

  return queryInfo.isLoading ? (
    'Loading...'
  ) : queryInfo.isError ? (
    queryInfo.error.message
  ) : (
    <div>
      {queryInfo.data?.sprites?.front_default ? (
        <img src={queryInfo.data?.sprites?.front_default} alt="" />
      ) : (
        'Pokemon not found.'
      )}
      <br />
      {queryInfo.isFetching ? 'Updating...' : null}
    </div>
  )
}

function usePokemon(pokemon) {
  return useQuery(
    ['pokemon', pokemon],
    // Pass the built-in `signal` argument of the query function to axios
    // to cancel a query before the query promise is settled.
    async ({signal}) =>
      new Promise((resolve) => setTimeout(resolve, 1000))
        .then(() =>
          axios.get(
            `https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`,
            {signal},
          ),
        )
        .then((res) => res.data),
    {
      retry: 1,
      retryDelay: 1000,
      cacheTime: Infinity,
      enabled: !!pokemon,
    },
  )
}

// alternative: debounce a setState
function useDebouncedState(value, time) {
  const [debouncedState, setDebouncedState] = React.useState(value)
  React.useEffect(() => {
    const timeout = setTimeout(() => setDebouncedState(value), time)
    return () => clearTimeout(timeout)
  }, [time, value])
  return debouncedState
}

export default App
