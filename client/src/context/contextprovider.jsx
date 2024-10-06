import React, { createContext,useMemo,useContext } from 'react'
import { io } from 'socket.io-client';

const socketcontext = createContext(null);

export const useSocket = ()=>{
    const socket = useContext(socketcontext);
    return socket;
}

export const Socketprovider = (props)=>{
    const socket = useMemo(()=>io('localhost:8000'),[])
    return(
        <socketcontext.Provider value={socket}>
          {props.children}
        </socketcontext.Provider>
    )
}