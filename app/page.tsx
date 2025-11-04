"use client"
interface Todo {
  _id?: string;
  title: string;
  desc: string;
  completed?: boolean;
  dueDate?: string; // ✅ deadline for task

}
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaPen, FaPlus } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import axios from 'axios'
import toast from 'react-hot-toast';

export default function page() {
  const [todo,setTodo] = useState<Todo[]>([])
  if(todo){
    console.log('todo',todo)
  }
  const router = useRouter()

  useEffect(()=>{
     const GetTodo = async()=>{
      try {
        const request = await axios.get('/api/todo/')
        const response = request.data
        setTodo(response.todos)
        console.log('Todos',response.todos)
        

      } catch (error) {
        console.log(error)
      }
     }
     GetTodo()
  },[])
  const handlenavigate =()=>{
    router.push('/add')
  }

  const handleUpdate = async (id:string|undefined) =>{
    // alert(id)
    router.push(`/edit/${id}`)
  }
  const handleComplete = async (id: string | undefined, completed: boolean | undefined) => {
  if (!id) return;

  try {
    // ✅ Send PATCH request to toggle completion
    const response = await axios.patch(`/api/todo/${id}`, {
      completed: !completed,
    });

    if (response.data.success) {
      // ✅ Different toast messages depending on action
      if (!completed) {
        toast.success("🎉 Task marked as completed!");
      } else {
        toast("🔄 Task marked as incomplete", { icon: "⚪" });
      }

      // ✅ Update local state instantly (no reload)
      setTodo((prevTodos) =>
        prevTodos.map((t) =>
          t._id === id ? { ...t, completed: !completed } : t
        )
      );
    }
  } catch (error) {
    console.error("Error updating todo:", error);
    toast.error("Failed to update task status");
  }
};



  
const handleDelete = async (id:string|undefined) => {
    try {
      const response = await axios.delete(`/api/todo/${id}`);
      if (response.data.success) {
        toast.success(response.data.message);
         setTodo((prevTodos) => prevTodos.filter((t) => t._id !== id));
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete todo");
    } }


  return (
    <>
    <div className='flex justify-center items-center bg-pink-200 h-full p-10'>
      <div className='bg-red-300  w-2/3 flex flex-col shadow-xl rounded-lg  mt-10 p-5'>
      <div className='flex justify-between items-center w-full'>
            <h1 className='font-bold  text-3xl '>TODO LIST</h1>
              <button className='rounded-none flex items-center bg-[#6C63FF] px-4 py-2 text-white ' onClick={handlenavigate}>Add 
                <FaPlus className='ml-2'/>
              </button>
      </div>
      <div className='flex gap-5 flex-col text-start'>
        {todo && todo.map((elem)=>{
          return(
                <div className='flex justify-between items-center w-full border-b-4 border-b-[#6C63FF] rounded-xl p-2' key={elem._id}>
          <div className='flex gap-1 flex-col w-60'>
            <h1 className='font-bold text-xl' >{elem.title}</h1>
            <p className='text-sm'>{elem.desc}</p>
            <p className="text-xs text-red-600">
    Deadline: {elem.dueDate ? new Date(elem.dueDate).toLocaleString() : "No deadline"}
  </p>
          </div>
          <div className='flex justify-center items-center flex-col gap-2' >
            <input
    type="checkbox"
    checked={elem.completed || false}
    onChange={() => handleComplete(elem._id, elem.completed)}
  />
             <MdDelete size={23} color='red' cursor={"pointer"} onClick={()=>handleDelete(elem._id)}/>
             <FaPen size={20} cursor={"pointer"} onClick={()=>handleUpdate(elem._id)} />
          </div>
        </div>
          )
        })}
      
       
      </div>
             
      </div>
     
    </div>

    </>
  )
}



