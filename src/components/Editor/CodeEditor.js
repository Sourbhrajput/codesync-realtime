import React from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
 

import { useEffect,useRef } from 'react';
 
 const CodeEditor = ({socket,roomId}) => {
   const editorRef=useRef();

 

  useEffect(()=>

  {
        async function init (){

    
        editorRef.current=Codemirror.fromTextArea(document.getElementById('textarea'),{
         mode:{name:'javascript',json:true},
         theme:'dracula',
         autoCloseTags:true,
         autoCloseBrackets:true,
         lineNumbers:true
     });

     editorRef.current.on('change',(instance,data)=>
     {   
         const {origin}=data;
         const code=instance.getValue();
         if(origin!=="setValue")
         {
             socket.current.emit('codeChange',{code,roomId});
         }
        
     })

    }
    init();

         
  },[]);

  useEffect(()=>
  {
  
    if(socket.current) 
   {

        socket.current.on('codeChange',({code})=>
        {
            if(code!==null)
            {
                editorRef.current.setValue(code);
                
            }

          
        })

        socket.current.on('syncCode',({code})=>
        {
            if(code!==null)
            {
                editorRef.current.setValue(code);
                 
            }
        })
   }
    
    

  },[socket.current]);

  return <textarea  id='textarea' ></textarea>
}
 
export default CodeEditor;