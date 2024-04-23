import { NextPage } from 'next'
import {
  ArrowLeftStartOnRectangleIcon,
  DocumentIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/solid'

import { supabase } from '../utils/supabase'
import { Layout } from '../components/Layout'
import { TaskForm } from '../components/TaskForm'
import { TaskList } from '../components/TaskList'
import { NoticeForm } from '../components/NoticeForm'
import { NoticeList } from '../components/NoticeList'
import { useQueryClient } from 'react-query'

const Dashboard: NextPage = () => {
  const queryClient = useQueryClient()
  const signOut = () => {
    supabase.auth.signOut()
    queryClient.removeQueries('todos')
    queryClient.removeQueries('notices')
  }

  return (
    <Layout title="Dashboard">
      <ArrowLeftStartOnRectangleIcon
        className="mb-6 h-6 w-6 cursor-pointer text-blue-500"
        onClick={signOut}
      />
      <div className="grid grid-cols-2 gap-40">
        <div>
          <div className="my-3 flex justify-center">
            <DocumentIcon className="h-8 w-8 text-blue-500" />
          </div>
          <TaskForm />
          <TaskList />
        </div>
        <div>
          <div className="my-3 flex justify-center">
            <GlobeAltIcon className="h-8 w-8 text-blue-500" />
          </div>
          <NoticeForm />
          <NoticeList />
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
