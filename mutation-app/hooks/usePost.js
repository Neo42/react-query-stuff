import axios from 'axios'
import { useQuery, useQueryClient } from 'react-query'

export const fetchPost = (_, postId) =>
  axios.get(`/api/posts/${postId}`).then((res) => res.data)

export default function usePost(postId) {
  const queryClient = useQueryClient()
  return useQuery(['posts', postId], fetchPost, {
    initialData: () =>
      queryClient.getQueryData('posts')?.find((d) => d.id === postId),
    initialStale: true,
  })
}
