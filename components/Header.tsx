import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
}

const Header = ({ children, className }: HeaderProps) => {
  return (
    <div className={cn("header", className)}>
        <Link href={'/'} className='md:flex-1 flex items-center'>
        <Image src="/assets/icons/logo-icon.svg" alt="logo"  width={32} height={32} className='mr-2' />
        <span className='text-2xl font-semibold hidden md:inline'>Writhub</span>
        </Link>
        {children}
    </div>
  )
}

export default Header