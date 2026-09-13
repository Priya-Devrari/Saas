import CompanionForm from '@/components/CompanionForm'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/dist/client/components/navigation';
import React from 'react'

const NewCompanion = async () => {
  const {userId}= await auth();
 if(!userId) redirect('/sign-in?redirect_url=/companions/new');
  return (
    <main className="min-lg:w-1/3 items-center justify-center ">
      <article className="w-full gap-4 flex flex-col">
        <h1>Create New Companion</h1>
<CompanionForm />
      </article>
    </main>
  )
}

export default NewCompanion
