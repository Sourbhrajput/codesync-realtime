import React from 'react'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import Home from './components/Home/Home';
import Editor from './components/Editor/Editor';
import { Toaster } from 'react-hot-toast';
const App = () => {
  return (
   <>
<div>
<Toaster position='top-right'
   toastOptions={{
     success:{
       theme:{
         primary:'#1ecf50'
       }
     }
   }} >


</Toaster>

</div>
    <Router>

<Routes>
  <Route path='/' element={<Home/>} > </Route>
  <Route path='/editor/:roomId' element={<Editor/>} > </Route>
  <Route path='*' element={<Home/>} > </Route>

</Routes>

    </Router>
   </>
  )
}

export default App