import { FC, useEffect, useState } from 'react'
import { Notice } from '../types/types'
import { useStore } from '../store'
import { useMutateNotice } from '../hooks/useMutateNotice'
import { supabase } from '../utils/supabase'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'

export const NoticeItem: FC<Omit<Notice, 'created_at'>> = ({
  id,
  content,
  user_id,
}) => {
  const [userId, setUserId] = useState<string | undefined>('')
  const update = useStore((state) => state.updateEditedNotice)
  const { deleteNoticeMutation } = useMutateNotice()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserId(user?.id)
    }
    getUser()
  }, [])

  return (
    <li className="my-3 text-lg font-extrabold">
      <span>{content}</span>
      <div className="float-right ml-20 flex">
        {userId === user_id && (
          <div className="float-right ml-20 flex">
            <PencilIcon
              className="mx-1 h-5 w-5 cursor-pointer text-blue-500"
              onClick={() => {
                update({
                  id: id,
                  content: content,
                })
              }}
            />
            <TrashIcon
              className="h-5 w-5 cursor-pointer text-blue-500"
              onClick={() => {
                deleteNoticeMutation.mutate(id)
              }}
            />
          </div>
        )}
      </div>
    </li>
  )
}
