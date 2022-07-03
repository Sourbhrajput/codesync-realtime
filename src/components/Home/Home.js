import React from 'react'
import './Home.css'
import { useState } from 'react' ;
import {useNavigate} from 'react-router-dom';
import {v4 as uuid} from 'uuid';
import toast from 'react-hot-toast';
import Logo from '../logo';
const Home = () => {

const [roomId,setRoomID] =useState();
const [userName,setUserName]=useState();
const navigate=useNavigate();
const join=(e)=>
{
    if(!roomId || !userName)
    {
      toast.error("Please enter Room ID and UserName")
      return;
    }
  
   navigate(`/editor/${roomId}`,{
     state:{userName}
   });
}

  return (
   
    <>
    <div className='container login_container'>
   <div className='room_container'>
    <Logo/>
   <h3>Paste invitation ROOM ID </h3>
   <div className='input'>
<input type="text" className='roomid' placeholder='ROOM ID' value={roomId} onChange={(e)=>{ setRoomID(e.target.value)}} onKeyDown={(e)=>{if(e.key==="Enter"){join()} }} />
<input type="text" className='username' placeholder='USERNAME' value={userName} onChange={(e)=>{setUserName(e.target.value)}}  onKeyDown={(e)=>{if(e.key==="Enter"){join()}}}/>
   </div>
   <div className='btn_div'> <button onClick={join}>Join</button></div>
   <div className='create' ><h3>If you don't have an invite then create <span className='span_link' onClick={(e)=>{setRoomID(uuid() );toast.success("New Room Created") }  }> new room</span></h3></div>
   </div>
  
  <h3 className='myname'>Built with <span>&#10084;</span> by <span className='span_link'><a href="https://github.com/Sourbhrajput/codeshare-realtime"> Sourbh kharakiya</a></span> </h3>
    </div>


    </>
  )
}

export default Home;