import Link from 'next/dist/client/link'
import React from 'react'
const navItem =[
    {label: "Home", href: "/"},
    {label: "Companions", href: "/companions"},
    {label: "My-Journey", href: "/my-journey"},
    {label: "Sign In", href: "/sign-in"}
]
const NavItem = () => {
  return (
    <nav className="flex items-center gap-4">
      {navItem.map(({label, href}) => (
        <Link key={label} href={href}>
          {label}
        </Link>
      ))} </nav> 
  )
}

export default NavItem
