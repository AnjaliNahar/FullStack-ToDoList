"use client"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

export default function page() {
  const [value,setValue] =useState({
    title:"",
    desc:"",
    dueDate: ""
  })
  const {push}=useRouter()
  const handleONchange=(e:any)=>{
    setValue({
      ...value,
      [e.target.name]:e.target.value
    })
  }
  const handleSubmit=async()=>{
   try {
    const request= await axios.post('/api/todo',
      {
  title: value.title,
  desc: value.desc,
  dueDate: value.dueDate, // ✅ include this
} )
  
    const response = request.data
    if(request.status===200){
      toast.success(response.message)
      push('/')
    }
    console.log('add',response)
   } catch (error) {
      console.log('error',error)
   }
  }
  return (

   <>
   
    <div className='h-screen flex justify-center'>
      <div className='mt-8 flex flex-col p-10 bg-[#6C63FF] h-100 rounded-lg gap-8 '>
        <h1 className='text-white font-bold text-2xl'>Add ToDo</h1>

       <label className='relative block'>
        
         <input className='placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md  py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:ring-sky-500 focus:ring-1 sm:text-sm' placeholder='Enter your title'  type="text" onChange={handleONchange}  name='title'/>
       </label>
        <label className='relative block'>
          
         <input className='placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300  rounded-md  py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:ring-sky-500 focus:ring-1 sm:text-sm' placeholder='Enter your Description'  type="text" name='desc' onChange={handleONchange} />
         
       </label>

       <label className='relative block'>
         <input 
  type="datetime-local"
  className="  border p-2 rounded-md block bg-white w-full border-slate-300 py-2 pl-9 pr-3 shadow-sm"
  value={value.dueDate}
  onChange={(e) => setValue({ ...value, dueDate: e.target.value })}
/>
       </label>
       <button className='bg-green-500 rounded-lg px-4 py-2 font-bold text-white ' onClick={handleSubmit}
       >Submit</button>
      </div>
    </div>
   
   </>
  )
}
