import React from 'react'
import {useQuery, useQueryClient} from 'react-query'
import axios from 'axios'
import {ReactQueryDevtools} from 'react-query/devtools'

export default function App() {
  const [show, toggle] = React.useReducer((d) => !d, false)
  const [postId, setPostId] = React.useState(-1)
  const queryClient = useQueryClient()

  React.useEffect(() => {
    queryClient.prefetchQuery('posts', fetchPosts, {
      staleTime: Infinity,
    })
  }, [queryClient])

  return (
    <>
      <div>
        <button onClick={toggle}>Show Posts</button>
        {show ? (
          postId > -1 ? (
            <Post postId={postId} setPostId={setPostId} />
          ) : (
            <Posts setPostId={setPostId} />
          )
        ) : null}
      </div>
      <ReactQueryDevtools />
    </>
  )
}

async function fetchPosts() {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return axios
    .get('https://jsonplaceholder.typicode.com/posts')
    .then((res) => res.data.slice(0, 10))
}

function Posts({setPostId}) {
  const postsQuery = useQuery('posts', fetchPosts)
  const queryClient = useQueryClient()

  return (
    <div>
      <h1>Posts {postsQuery.isFetching ? '...' : null}</h1>
      <div>
        {postsQuery.isLoading ? (
          'Loading posts...'
        ) : (
          <ul>
            {postsQuery.data.map((post) => {
              return (
                <li
                  key={post.id}
                  onMouseEnter={() => {
                    queryClient.prefetchQuery(
                      ['post', post.id],
                      () => fetchPost(post.id),
                      {
                        staleTime: Infinity,
                      },
                    )
                  }}>
                  <a onClick={() => setPostId(post.id)} href="#">
                    {post.title}
                  </a>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

async function fetchPost(postId) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return axios
    .get(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    .then((res) => res.data)
}

function Post({postId, setPostId}) {
  const postQuery = useQuery(['post', postId], () => fetchPost(postId), {
    staleTime: 1000 * 60,
  })

  return (
    <div>
      <a onClick={() => setPostId(-1)} href="#">
        Back
      </a>
      <br />
      <br />
      {postQuery.isLoading ? (
        'Loading...'
      ) : (
        <>
          {postQuery.data.title}
          <br />
          <br />
          {postQuery.isFetching ? 'Updating...' : null}
        </>
      )}
    </div>
  )
  //
}
