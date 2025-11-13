

"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

export default function EditTodoPage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const [todo, setTodo] = useState({
    title: "",
    desc: "",
    dueDate: "",
  });

  // Fetch existing todo
  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await axios.get(`/api/todo/${id}`);
        if (response.data.success) {
          setTodo(response.data.todo);
        } else {
          toast.error("Failed to load Todo");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong!");
      }
    };
    fetchTodo();
  }, [id]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTodo({
      ...todo,
      [e.target.name]: e.target.value,
    });
  };

  // Handle update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`/api/todo/${id}`, todo);
      if (response.data.success) {
        toast.success("✅ Todo updated successfully!");
        router.push("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-[url('/board-b.avif')] bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center p-6">
      {/* Motivational Quote */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-black drop-shadow-lg mb-2">
          📝 Edit Your Task
        </h1>
        <p className="italic text-black/90 text-lg">
          “Improving your work is the key to progress.” 🌻
        </p>
      </div>

      {/* Sticky Note Card */}
      <div className="backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md transform -rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="title"
            placeholder="Enter your title"
            value={todo.title}
            onChange={handleChange}
            required
            className="p-3 rounded-md border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-gray-500"
          />

          <textarea
            name="desc"
            placeholder="Enter your description"
            value={todo.desc}
            onChange={handleChange}
            required
            rows={3}
            className="p-3 rounded-md border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-gray-500 resize-none"
          />

          <input
            type="datetime-local"
            name="dueDate"
            value={todo.dueDate ? todo.dueDate.slice(0, 16) : ""}
            onChange={handleChange}
            className="p-3 rounded-md border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-600"
          />

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-md shadow-lg transition-transform transform hover:scale-105"
          >
            Update
          </button>
        </form>
      </div>

      {/* Floating Button to Go Back */}
      <button
        onClick={() => router.push("/")}
        className="fixed bottom-10 right-10 bg-[#6C63FF] hover:bg-[#5850EC] text-white font-bold py-3 px-6 rounded-full shadow-xl flex items-center gap-2 transition-all"
      >
        ⬅ Back
      </button>
    </div>
  );
}
