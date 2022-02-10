import React from 'react'
import axios from 'axios'
import { useQuery, useQueryClient } from 'react-query'

export default function Posts() {
  const [page, setPage] = React.useState(0)
  const queryClient = useQueryClient()

  // prevent unnecessary function re-initialization of `fetchPosts` with useCallback
  const fetchPosts = React.useCallback(() => {
    return axios
      .get('/api/posts', {
        params: {
          pageSize: 10,
          pageOffset: page,
        },
      })
      .then((res) => res.data)
  }, [page])

  const { isLoading, isFetching, data } = useQuery(
    ['posts', { page }],
    fetchPosts,
    { keepPreviousData: true }
  )

  // once the page changes, prefetch for the next page using the `nextPageOffset` in the data response
  React.useEffect(() => {
    queryClient.prefetchQuery(
      ['posts', { page: data?.nextPageOffset }],
      fetchPosts
    )
  }, [data?.nextPageOffset, fetchPosts, queryClient])

  return (
    <div>
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <>
          <h3>Posts {isFetching ? <small>...</small> : null}</h3>
          {data.items.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}{' '}
          <br />
        </>
      )}
      <button onClick={() => setPage(page - 1)} disabled={page === 0}>
        Previous
      </button>{' '}
      <button
        onClick={() => setPage(page + 1)}
        disabled={!data?.nextPageOffset}
      >
        Next
      </button>{' '}
      <span>Current Page: {page + 1}</span> {isFetching ? '...' : ' '}
    </div>
  )
}
