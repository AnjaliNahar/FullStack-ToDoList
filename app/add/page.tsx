

"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AddTodoPage() {
  const [todo, setTodo] = useState({
    title: "",
    desc: "",
    dueDate: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTodo({
      ...todo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/todo", todo);
      if (response.data.success) {
        toast.success("✅ Todo added successfully!");
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
    <div className="min-h-screen bg-[url('/board-bg.jpg')] bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center p-6">
      {/* Motivational Quote */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-black drop-shadow-lg mb-2">
          ✨ Add a New Task
        </h1>
        <p className="italic text-black/90 text-lg">
          “Every small task you complete brings you closer to your goals.” 🌱
        </p>
      </div>

      {/* Note Card */}
      <div className="backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md transform rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300">
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
            placeholder="Enter your Description"
            value={todo.desc}
            onChange={handleChange}
            required
            rows={3}
            className="p-3 rounded-md border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-gray-500 resize-none"
          />

          <input
            type="datetime-local"
            name="dueDate"
            value={todo.dueDate}
            onChange={handleChange}
            className="p-3 rounded-md border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-600"
          />

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-md shadow-lg transition-transform transform hover:scale-105"
          >
            Submit
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

