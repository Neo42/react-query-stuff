import axios from 'axios'
import { useMutation, useQueryClient } from 'react-query'

export default function useSavePost() {
  const queryClient = useQueryClient()
  return useMutation(
    (values) =>
      axios.patch(`/api/posts/${values.id}`, values).then((res) => res.data),
    {
      onMutate: (values) => {
        const oldPost = queryClient.getQueryData(['posts', values.id])
        queryClient.setQueryData(['posts', values.id], values)
        return () => queryClient.setQueryData(['posts', values.id], oldPost)
      },
      onError: (error, values, rollback) => rollback(),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries('posts')
        queryClient.invalidateQueries(['posts', variables.id])
      },
    }
  )
}
