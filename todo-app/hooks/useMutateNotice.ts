import { useMutation, useQueryClient } from 'react-query'
import { useStore } from '../store'
import { EditedNotice, Notice } from '../types/types'
import { supabase } from '../utils/supabase'

export const useMutateNotice = () => {
  const queryClient = useQueryClient()
  const reset = useStore((state) => state.resetEditedNotice)

  const createNoticeMutation = useMutation(
    async (notice: Omit<Notice, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('notices')
        .insert(notice)
        .select()
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        const previousNotices = queryClient.getQueryData<Notice[]>('notices')
        if (previousNotices) {
          queryClient.setQueryData('notices', [...previousNotices, res[0]])
        }
        reset()
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    },
  )

  const updateNoticeMutation = useMutation(
    async (notice: EditedNotice) => {
      const { data, error } = await supabase
        .from('notices')
        .update({ content: notice.content })
        .eq('id', notice.id)
        .select()
      console.log(data)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res, variables) => {
        const previousNotices = queryClient.getQueryData<Notice[]>('notices')
        if (previousNotices) {
          queryClient.setQueryData(
            'notices',
            previousNotices.map((notice) =>
              notice.id === variables.id ? res[0] : notice,
            ),
          )
        }
        reset()
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    },
  )

  const deleteNoticeMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase
        .from('notices')
        .delete()
        .eq('id', id)
        .select()
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (_, variables) => {
        const previousNotices = queryClient.getQueryData<Notice[]>('notices')
        if (previousNotices) {
          queryClient.setQueryData(
            'notices',
            previousNotices.filter((notice) => notice.id !== variables),
          )
        }
        reset()
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    },
  )

  return { deleteNoticeMutation, createNoticeMutation, updateNoticeMutation }
}
