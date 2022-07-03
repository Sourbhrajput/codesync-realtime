import React from 'react';
import Avatar from 'react-avatar';

const avtar = ({userName}) => {
  if(!userName)
  {
    return
  }
  return (
      <div className='client'>
    <Avatar name={userName} size={30} round="4px" />
   <p>{userName}</p>
    </div>
  )
}

export default avtar