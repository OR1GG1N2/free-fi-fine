"use client";
import { Wifi, LogIn, User } from "lucide-react";
import { Button } from '../button'
import Link from 'next/link'

import { useSession, signIn, signOut } from "next-auth/react"


export default function NavBar(){
   
    const { data: session, status } = useSession()
    return(
        <header className="p-4 bg-white border-b flex justify-between items-center">
        
    <div className="flex items-center gap-2">
        <div className="flex item-center ">
            <Wifi className="mr-2" />
            <h1 className="font-bold flex items-center text-2xl">Free-WiFi-Map</h1>
                  
        </div>
       
    </div>
      
            {!session && (
                            <>
<Button
    
    variant="default"
    size="sm"
    className="mr-2 p-3 justify-end "
    
    >
    
    <LogIn/><Link href="/login" className="md:flex hidden">Авторизація</Link>  </Button>  
                            </>
                        )}   
                              {session && (
                            <>
                            <div>Вітаємо {session.user.name}</div>
<Button
    
    variant="default"
    size="sm"
    className="mr-2 p-3 justify-end "
    onClick={() => signOut()}
    
    >
    
    <LogIn/><div className="md:flex hidden">Вийти</div>  </Button>  
                            </>
                        )}  
            {/* Реализровать авторизацию - https://ru.legacy.reactjs.org/docs/conditional-rendering.html */}  
     
</header>
    );
    // if (status === "authenticated") {
    //   return <p>Signed in as {session.user.image}</p>
    // }
  
    // return <a href="/api/auth/signin">Sign in</a>
    
}
