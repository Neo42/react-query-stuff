import React from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import axios from 'axios'

import PostForm from '../components/PostForm'

export default function Posts() {
  const queryClient = useQueryClient()
  const postsQuery = useQuery('posts', () =>
    axios.get('/api/posts').then((res) => res.data)
  )
  const { mutate, isIdle, isError, isLoading, isSuccess, error } = useMutation(
    (values) => axios.post('/api/posts', values),
    {
      onMutate: (values) => {
        // cancel all ongoing queries, if any, before optimistic update
        queryClient.cancelQueries()
        const backupPosts = queryClient.getQueryData('posts')
        queryClient.setQueryData('posts', (oldPosts) => {
          return [
            ...oldPosts,
            {
              ...values,
              id: Date.now(),
            },
          ]
        })
        return () => queryClient.setQueryData('posts', backupPosts)
      },
      // onError gets what onMutate returns via the third argument `rollback`
      onError: (error, values, rollback) => {
        if (rollback) {
          rollback()
        }
      },
      onSettled: () => queryClient.invalidateQueries('posts'),
    }
  )

  return (
    <section>
      <div>
        <div>
          {postsQuery.isLoading ? (
            <span>Loading...</span>
          ) : (
            <>
              <h3>Posts {postsQuery.isFetching ? <small>...</small> : null}</h3>
              <ul>
                {postsQuery.data.map((post) => (
                  <Link key={post.id} href="/[postId]" as={`/${post.id}`}>
                    <a>
                      <li key={post.id}>{post.title}</li>
                    </a>
                  </Link>
                ))}
              </ul>
              <br />
            </>
          )}
        </div>
      </div>

      <hr />

      <div>
        <h3>Create New Post</h3>
        <div>
          <PostForm
            clearOnSubmit
            onSubmit={mutate}
            submitText={
              isIdle
                ? 'Create Post'
                : isError
                ? 'Something is wrong!'
                : isLoading
                ? 'Posting...'
                : isSuccess
                ? 'Posted!'
                : null
            }
          />
          {isError ? <pre>{error.response.data.message}</pre> : null}
        </div>
      </div>
    </section>
  )
}
