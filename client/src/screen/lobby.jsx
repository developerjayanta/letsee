import React, { useCallback, useState, useEffect } from 'react'
import { useSocket } from '../context/contextprovider'
import {useNavigate} from 'react-router-dom'
const Lobby = () => {
    let [email, setemail] = useState("")
    let [roomid, setroomid] = useState("")

    const navigate = useNavigate();
    const socket = useSocket();
    console.log(socket);

    const handleSubmitForm = useCallback( (e)=>{
        e.preventDefault();
       socket.emit("room:join",{roomid,email})

    }, [roomid,socket,email]

    )
const roomJoinHandle = useCallback((data)=>{
const {email,roomid} = data;
navigate(`/room/${roomid}`)
},[navigate])
    useEffect(()=>{
socket.on("room:join",roomJoinHandle)
return ()=>{
  socket.off("room:join",roomJoinHandle)
}
    },[socket, roomJoinHandle])
    
  return (
    <div>
       <h2>user info</h2>
       <form onSubmit={handleSubmitForm}>
       <label htmlFor='email'> email id </label>
       <input type='email' id='email' value={email} onChange={(e)=>setemail(e.target.value)}/> <br></br>
       <label htmlFor='room'>room id</label>
       <input type='text' id='room' value={roomid} onChange={(e)=>setroomid(e.target.value)}/>
       <br/>
       <button>join</button>
       
       </form>

        </div>
  )
}

export default Lobby