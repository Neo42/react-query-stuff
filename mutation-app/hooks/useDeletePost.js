import axios from 'axios'
import { useMutation, useQueryClient } from 'react-query'

export default function useDeletePost() {
  const queryClient = useQueryClient()
  return useMutation(
    (postId) => axios.delete(`/api/posts/${postId}`).then((res) => res.data),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries('posts')
      },
    }
  )
}
