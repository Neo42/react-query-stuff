import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

import PostForm from '../components/PostForm'

export default function Post() {
  const queryClient = useQueryClient()
  const {
    query: { postId },
  } = useRouter()

  const postQuery = useQuery(['post', postId], () =>
    axios.get(`/api/posts/${postId}`).then((res) => res.data)
  )

  const {
    mutate: savePost,
    isError,
    isLoading,
    isSuccess,
  } = useMutation(
    (values) =>
      axios.patch(`/api/posts/${values.id}`, values).then((res) => res.data),
    {
      onMutate: (values) => {
        queryClient.cancelQueries()
        const backupPost = queryClient.getQueryData(['post', String(values.id)])
        queryClient.setQueryData(['post', String(values.id)], values)
        return () =>
          queryClient.setQueryData(['post', String(values.id)], backupPost)
      },
      onError: (error, values, rollback) => {
        if (rollback) {
          rollback()
        }
      },
      // react-query send s data an d values
      // passed into the mutate function back via props
      //! IN STRING FORMAT, so convert the id to string
      onSuccess: (data, values) => {
        // set the query data with new data coming back
        queryClient.setQueryData(['post', String(values.id)], data)
        // also invalidate query just in case
        queryClient.invalidateQueries(['post', String(values.id)])
      },
      onSettled: (data, error, values) =>
        queryClient.invalidateQueries(['post', String(values.id)]),
    }
  )

  return (
    <>
      {postQuery.isLoading ? (
        <span>Loading...</span>
      ) : (
        <div>
          <h3>
            <Link href="/[postId]" as={`/${postQuery.data.id}`}>
              <a>
                {postQuery.data.title} {postQuery.isFetching ? '...' : null}
              </a>
            </Link>
          </h3>
          <p>
            <small>Post ID: {postQuery.data.id}</small>
          </p>
          <PostForm
            initialValues={postQuery.data}
            onSubmit={savePost}
            submitText={
              isLoading
                ? 'Saving...'
                : isError
                ? 'Error!'
                : isSuccess
                ? 'Saved!'
                : 'Save Post'
            }
          />
        </div>
      )}
    </>
  )
}
