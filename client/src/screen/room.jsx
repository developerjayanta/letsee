import React, { useState }  from 'react'
import ReactPlayer from 'react-player'
import { useEffect, useCallback } from 'react';
import { useSocket } from '../context/contextprovider';
import peer from '../service/peer';


const Room = () => {
    const socket = useSocket();
const [remotesocketid,setRemoteSocketid] = useState(null);
const [mystream,setmystream] = useState(null);
const [remoteStream, setremoteStream] = useState(null);

    const handleuserjoined = useCallback(({email,id})=>{
console.log(`email ${email} joined room`);
setRemoteSocketid(id);
    },[]);

    const handleincomingcall = useCallback(async({from,offer})=>{
        setRemoteSocketid(from);
console.log("incomming call", offer);
const stream = await navigator.mediaDevices.getUserMedia({audio:true, video:true});
setmystream(stream);

const ans = await peer.getAnswer(offer);

socket.emit("call:accepted", {to:from, ans});
    },[socket]);

const sendStreams =useCallback(()=>{
   if(mystream){
    for(const track of mystream.getTracks()){
        peer.peer.addTrack(track,mystream);
    };
   } else{
    console.log("mystream is not available");
   }
},[mystream,peer]);

    const handlecallaccepted = useCallback(({from,ans})=>{
peer.setLocalDescription(ans);
console.log("call accepted");
sendStreams();
    },[sendStreams])


    const handlenegoincomingdone = useCallback( async ({from,offer})=>{
const ans = await peer.getAnswer(offer);
socket.emit("peer:nego:done", {to:from, ans})
    },[socket]);
    const handlenegoincomingfinal = useCallback(async({ans})=>{
      await  peer.setLocalDescription(ans)
    },[])

useEffect(()=>{
socket.on("user:joined",handleuserjoined);
socket.on("incoming:call", handleincomingcall);
socket.on("call:accepted", handlecallaccepted);
socket.on("peer:nego:needed", handlenegoincomingdone);
socket.on("peer:nego:final", handlenegoincomingfinal);

return ()=>{socket.off("user:joined", handleuserjoined)
            socket.off("incoming:call", handleincomingcall)
            socket.off("call:accepted", handlecallaccepted);
            socket.off("peer:nego:needed", handlenegoincomingdone);
            socket.off("peer:nego:final", handlenegoincomingfinal);
};
}, [socket,handleuserjoined,handleincomingcall,handlecallaccepted,handlenegoincomingdone,handlenegoincomingfinal])


const handlenegoneeded = useCallback(async ()=>{
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed",{offer, to:remotesocketid});
},[socket,remotesocketid])

useEffect(()=>{
    peer.peer.addEventListener("negotiationneeded",handlenegoneeded);
    return () =>{
        peer.peer.removeEventListener("negotiationneeded",handlenegoneeded);
    }
},[handlenegoneeded])


useEffect (()=>{
peer.peer.addEventListener("track", async (ev)=>{
    const remoteStream = ev.streams;
    setremoteStream(remoteStream[0]);
})
},[])

const handleusercall = useCallback(async()=>{
const stream = await navigator.mediaDevices.getUserMedia({audio:true, video:true});
const offer = await peer.getOffer();
socket.emit("user:call",{to:remotesocketid,offer});
setmystream(stream);
},[remotesocketid,socket])
  return (
    <div><h1>room </h1>
    <h2>{remotesocketid ? 'connected' : 'no one in room'}</h2>
   {remotesocketid && <button onClick={handleusercall}>call</button>}
   {mystream && <button onClick={sendStreams}>send stream</button>}
   { mystream && (<><h2>my video</h2><ReactPlayer playing muted height="300px" width="350px" url={mystream}/> </>)}

   { remoteStream  && (<><h2>remote video</h2><ReactPlayer playing muted height="300px" width="350px" url={remoteStream}/> </>)}
   
   </div>
  )
}

export default Room;