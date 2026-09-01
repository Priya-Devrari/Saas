'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import NavItem from '../NavItem'
import { Show, SignInButton, UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/dist/client/components/navigation'

const Navbar = () => {
   
  return (
    <nav className="navbar">
      <Link href="/"><div className="flex items-center gap-2.5 cursor-pointer">
        <Image src="/images/logo.svg" alt="logo" width={46} height={44} /></div></Link>
        <div className="flex items-center gap-8">
            <NavItem />
            <Show when="signed-out">
                <SignInButton><button className="btn-signin"> Sign In</button></SignInButton>
            </Show>
            <Show when="signed-in">  
              <UserButton />
            </Show>
        </div>
    </nav>
  )
}

export default Navbar