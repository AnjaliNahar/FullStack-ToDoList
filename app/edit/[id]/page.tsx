

"use client"
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const [value, setValue] = useState({
    title: "",
    desc: ""
  });
  const { push } = useRouter();
  const params = useParams(); // get id from URL

  // ✅ Fetch todo data when page loads
  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await axios.get(`/api/todo/${params.id}`);
        if (response.data.success) {
          setValue({
            title: response.data.todo.title,
            desc: response.data.todo.desc
          });
        }
      } catch (error) {
        console.log("Error fetching todo:", error);
      }
    };
    fetchTodo();
  }, [params.id]);

  const handleONchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
    });
  };

  // ✅ Handle update
  const handleSubmit = async () => {
    
    try {
      const request = await axios.patch(`/api/todo/${params.id}`, value);
      const response = request.data;

      if (request.status === 200) {
        toast.success(response.message);
        push("/"); // redirect back to home
      }
    } catch (error) {
      console.log("Error updating todo:", error);
      toast.error("Failed to update todo");
    }
  };

  return (
    <div className="h-screen flex justify-center">
      <div className="mt-8 flex flex-col p-10 bg-[#6C63FF] h-80 rounded-lg gap-8">
        <h1 className="text-white font-bold text-2xl">Update ToDo</h1>

        <label className="relative block">
          <input
            value={value.title}
            onChange={handleONchange}
            name="title"
            className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:ring-sky-500 focus:ring-1 sm:text-sm"
            placeholder="Enter your title"
            type="text"
          />
        </label>

        <label className="relative block">
          <input
            value={value.desc}
            onChange={handleONchange}
            name="desc"
            className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:ring-sky-500 focus:ring-1 sm:text-sm"
            placeholder="Enter your description"
            type="text"
          />
        </label>

        <button
          className="bg-green-500 rounded-lg px-4 py-2 font-bold text-white"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

