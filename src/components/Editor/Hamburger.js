import React from 'react'
import './Hamburger.css';
import { useRef,useState } from 'react';


const Hamburger = ( {setLeftSide}) => {
 const [ham,setHam]=useState(false);

  const change=(e)=>{
   
     if(ham)
     {
      setHam(false);
      setLeftSide(false);
      return;
     }
     setHam(true);
     setLeftSide(true);
   
   }
  return (
    <div   className={ ham ?`hamburger-container menu-item-animation`: 'hamburger-container' } onClick={change} >
    
    <div className="menuitems" >
        <div className="line">
        </div>
  
</div>
</div>
  )
}

export default Hamburger;