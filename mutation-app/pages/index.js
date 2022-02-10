import React from 'react'
import axios from 'axios'
import { useInfiniteQuery } from 'react-query'

export default function Posts() {
  const fetchPosts = React.useCallback(
    ({ pageParam = 0 }) =>
      axios
        .get('/api/posts', {
          params: {
            pageSize: 10,
            pageOffset: pageParam,
          },
        })
        .then((res) => res.data),
    []
  )

  const { isLoading, isFetching, data, fetchNextPage, hasNextPage } =
    useInfiniteQuery('posts', fetchPosts, {
      getNextPageParam: (lastPage) => lastPage.nextPageOffset,
    })

  return (
    <div>
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <>
          <h3>Posts {isFetching ? <small>...</small> : null}</h3>
          {data.pages.map((page, index) => (
            <React.Fragment key={index}>
              {page.items.map((post) => (
                <li key={post.id}>{post.title}</li>
              ))}
            </React.Fragment>
          ))}{' '}
          <br />
          <button onClick={fetchNextPage} disabled={!hasNextPage}>
            Fetch More
          </button>
        </>
      )}
    </div>
  )
}
