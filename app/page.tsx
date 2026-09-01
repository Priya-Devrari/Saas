import CompanionCard from '@/components/CompanionCard'
import CompanionList from '@/components/CompanionList'
import Cta from '@/components/Cta'
import { Button } from '@/components/ui/button'
import { recentSessions } from '@/constants'
import React from 'react'
import Navbar from '@/components/ui/Navbar'

export const dynamic = 'force-dynamic'

const Page = () => {
  return (
    <main>
  
      <h2 className="text-2xl underline">Popular Companions</h2>
      <section className="home-section">
        <CompanionCard id="123"
        name="Neura The Brainy Explorer"
        topic="Neural Network of the Brain"
        subject="Science"
        duration={45}
        color="#ffda69"
        />
         <CompanionCard id="456"
        name="Countsy the number wizard"
        topic="Derivatives and Integrals"
        subject="Maths"
        duration={30}
        color="#e5b8ff"
        />
         <CompanionCard id="789"
        name="Verba the vocabulary builder"
        topic="Language"
        subject="English Literature"
        duration={30}
        color="#BDE7FF"
        />
       
      </section>
      <section className="home-section">
        <CompanionList title="Recently Completed Sessions" companions={recentSessions} classNames="w-2/3 max-lg: w-full" />
        <Cta />
      </section>
      
    </main>
  )
}

export default Page