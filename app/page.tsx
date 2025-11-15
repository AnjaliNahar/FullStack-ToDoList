
"use client";
interface Todo {
  _id?: string;
  title: string;
  desc: string;
  completed?: boolean;
  dueDate?: string; // ✅ deadline for task
  expired?: boolean;
}

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaPen, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";

export default function Page() {
  const [todo, setTodo] = useState<Todo[]>([]);
  const router = useRouter();

  // Popup state
const [showPopup, setShowPopup] = useState(false);

const [newTask, setNewTask] = useState({
  title: "",
  desc: "",
  dueDate: "",
});

// Edit popup state
const [showEditPopup, setShowEditPopup] = useState(false);

const [editTask, setEditTask] = useState({
  _id: "",
  title: "",
  desc: "",
  dueDate: "",
});

const openEditPopup = async (id: string | undefined) => {
  try {
    const res = await axios.get(`/api/todo/${id}`);

    if (res.data.success) {
      setEditTask({
        _id: res.data.todo._id,
        title: res.data.todo.title,
        desc: res.data.todo.desc,
        dueDate: res.data.todo.dueDate?.slice(0, 16) || "",
      });

      setShowEditPopup(true);
    }
  } catch (error) {
    toast.error("Failed to load task");
  }
};



// Handle input change
const handlePopupChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  setNewTask({ ...newTask, [e.target.name]: e.target.value });
};

// Submit popup form
const handlePopupSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await axios.post("/api/todo", newTask);

    if (response.data.success) {
      toast.success("🎉 Task added!");

      // Close popup
      setShowPopup(false);

      // Reset input
      setNewTask({ title: "", desc: "", dueDate: "" });

      // Refresh tasks
      setTodo((prev) => [...prev, response.data.todo]);
    }
  } catch (error) {
    toast.error("Failed to add task");
  }
};


  useEffect(() => {
    const GetTodo = async () => {
      try {
        const request = await axios.get("/api/todo/");
        const response = request.data;

        // ✅ Check if deadline has passed (for expired tasks)
        const updatedTodos = response.todos.map((t: Todo) => {
          if (t.dueDate && new Date(t.dueDate) < new Date() && !t.completed) {
            return { ...t, expired: true };
          }
          return { ...t, expired: false };
        });

        setTodo(updatedTodos);
      } catch (error) {
        console.log(error);
      }
    };
    GetTodo();
    const interval = setInterval(() => {
    setTodo((prevTodos) =>
      prevTodos.map((t) => {
        if (t.dueDate && new Date(t.dueDate) < new Date() && !t.completed) {
          return { ...t, expired: true };
        }
        return { ...t, expired: false };
      })
    );
  }, 30000); // 30 seconds

  return () => clearInterval(interval);
  }, []);

  // const handleNavigate = () => {
  //    if (!isLoggedIn) {
  //   toast.error("⚠️ Please login to add a task!");
  //   return;
  // }
  //   router.push("/add");
  // };

 


  // const handleUpdate = async (id: string | undefined) => {
  //   router.push(`/edit/${id}`);
  // };

  const handleEditSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await axios.patch(`/api/todo/${editTask._id}`, {
      title: editTask.title,
      desc: editTask.desc,
      dueDate: editTask.dueDate,
    });

    if (res.data.success) {
      toast.success("✨ Task updated!");

      setShowEditPopup(false);

      setTodo((prev) =>
        prev.map((t) => (t._id === editTask._id ? res.data.todo : t))
      );
    }
  } catch (error) {
    toast.error("Failed to update task");
  }
};


  const handleComplete = async (id: string | undefined, completed: boolean | undefined) => {
    if (!id) return;
    try {
      const response = await axios.patch(`/api/todo/${id}`, {
        completed: !completed,
      });

      if (response.data.success) {
        toast.success(!completed ? "🎉 Task marked as completed!" : "🔄 Task marked as incomplete");

        setTodo((prevTodos) =>
          prevTodos.map((t) => (t._id === id ? { ...t, completed: !completed } : t))
        );
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Failed to update task status");
    }
  };

  const handleDelete = async (id: string | undefined) => {
    try {
      const response = await axios.delete(`/api/todo/${id}`);
      if (response.data.success) {
        toast.success(response.data.message);
        setTodo((prevTodos) => prevTodos.filter((t) => t._id !== id));
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete todo");
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  // ✅ Split tasks into categories
  const pendingTasks = todo.filter((t) => !t.completed && !t.expired);
  const completedTasks = todo.filter((t) => t.completed);
  const expiredTasks = todo.filter((t) => !t.completed && t.expired);

  return (
    <>
      <div className="min-h-screen bg-[url('/board.avif')] bg-cover bg-center bg-no-repeat flex flex-col items-center p-10 relative">
        {/* Login / Signup / Logout Buttons */}
        <div className="absolute top-5 right-5 flex gap-3">
          {!isLoggedIn ? (
            <>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                onClick={() => router.push("/login")}
              >
                Login
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                onClick={() => router.push("/signup")}
              >
                Signup
              </button>
            </>
          ) : (
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              onClick={() => {
                localStorage.removeItem("user");
                setIsLoggedIn(false);
                toast.success("Logged out successfully!");
              }}
            >
              Logout
            </button>
          )}
        </div>

        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="lg:text-5xl sm:text-2xl font-extrabold text-black drop-shadow-lg mb-3">
            🌸 My Productivity Board
          </h1>
          <p className="italic text-brown/90 text-lg">
            “Do something today that your future self will thank you for.” 🌿
          </p>
        </div>

        {/* Add Task Button */}
        {/* <button
          onClick={handleNavigate}
          className="fixed bottom-10 right-10 bg-[#6C63FF] hover:bg-[#5753D8] text-white font-bold py-3 px-5 rounded-full shadow-xl flex items-center gap-2"
        >
          <FaPlus /> Add Task
        </button> */}

         <button
  onClick={() => {
    if (!isLoggedIn) {
      toast.error("⚠️ Please login to add a task!");
      return;
    }
    setShowPopup(true);
  }}
  className="fixed bottom-10 right-10 bg-[#6C63FF] hover:bg-[#5753D8] text-white font-bold py-3 px-5 rounded-full shadow-xl flex items-center gap-2"
>
  <FaPlus /> Add Task
</button>

        {/* 🟡 Pending Tasks Section */}
        <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-3">🕓 Pending Tasks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {pendingTasks.length === 0 && (
            <p className="text-center text-black text-xl col-span-full">
              🎯 You have no pending tasks!
            </p>
          )}

          {pendingTasks.map((elem, i) => {
            const colors = ["bg-yellow-100", "bg-pink-100", "bg-green-100", "bg-blue-100", "bg-purple-100"];
            const rotations = ["rotate-1", "-rotate-2", "rotate-2", "-rotate-1", "rotate-3"];
            const color = colors[i % colors.length];
            const rotation = rotations[i % rotations.length];

            return (
              <div
                key={elem._id}
                className={`${color} ${rotation} shadow-xl rounded-xl p-5 cursor-pointer transform transition-all hover:scale-105`}
              >
                <h2 className="font-bold text-lg mb-1">{elem.title}</h2>
                <p className="text-sm text-gray-700 mb-2">{elem.desc}</p>
                <p className="text-xs text-gray-600 mb-3">
                  Deadline: {elem.dueDate ? new Date(elem.dueDate).toLocaleString() : "No deadline"}
                </p>
                <div className="flex justify-between items-center">
                  <input
                    type="checkbox"
                    checked={elem.completed || false}
                    onChange={() => handleComplete(elem._id, elem.completed)}
                  />
                  <div className="flex gap-2">
                    <FaPen size={18} onClick={() => openEditPopup(elem._id)} className="cursor-pointer" />
                    <MdDelete size={20} color="red" onClick={() => handleDelete(elem._id)} className="cursor-pointer" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ✅ Completed Tasks Section */}
        <h2 className="text-2xl font-bold text-green-700 mt-12 mb-3">✅ Completed Tasks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {completedTasks.length === 0 && (
            <p className="text-center text-gray-600 text-xl col-span-full">No completed tasks yet 🌱</p>
          )}
          {completedTasks.map((elem, i) => (
            <div
              key={elem._id}
              className="bg-green-100 shadow-md rounded-xl p-5 border-l-4 border-green-600 opacity-90"
            >
              <h2 className="font-semibold text-lg text-green-800 mb-1">{elem.title}</h2>
              <p className="text-sm text-gray-700 mb-2">{elem.desc}</p>
              <p className="text-xs text-gray-600">Completed ✅</p>

        
            </div>
          ))}
        </div>

        {/* 🔴 Expired Tasks Section */}
        <h2 className="text-2xl font-bold text-red-700 mt-12 mb-3">⏰ Deadline Over</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {expiredTasks.length === 0 && (
            <p className="text-center text-gray-600 text-xl col-span-full">No expired tasks yet 🎉</p>
          )}
          {expiredTasks.map((elem, i) => (
            <div
              key={elem._id}
              className="bg-red-100 shadow-md rounded-xl p-5 border-l-4 border-red-600 opacity-90"
            >
              <h2 className="font-semibold text-lg text-red-800 mb-1">{elem.title}</h2>
              <p className="text-sm text-gray-700 mb-2">{elem.desc}</p>
              <p className="text-xs text-red-700 font-semibold">Deadline missed ❌</p>
            </div>
          ))}
        </div>
        {showPopup && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center  z-50">
    <div className="bg-white  p-6 rounded-xl w-full max-w-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">✨ Add New Task</h2>
      <p className="italic text-black/90 text-sm">
          “Every small task you complete brings you closer to your goals.” 🌱
        </p>

      <form onSubmit={handlePopupSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          placeholder="Enter title"
          value={newTask.title}
          onChange={handlePopupChange}
          required
          className="border p-3 rounded"
        />

        <textarea
          name="desc"
          placeholder="Enter description"
          value={newTask.desc}
          onChange={handlePopupChange}
          required
          rows={3}
          className="border p-3 rounded"
        />

        <input
          type="datetime-local"
          name="dueDate"
          value={newTask.dueDate}
          onChange={handlePopupChange}
          className="border p-3 rounded"
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          Submit
        </button>
      </form>

      <button
        onClick={() => setShowPopup(false)}
        className="mt-4 text-red-500 font-semibold w-full"
      >
        Close
      </button>
    </div>
  </div>
)}

{showEditPopup && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl">

      <h2 className="text-2xl font-bold mb-4 text-center">📝 Edit Task</h2>
      <p className="italic text-black/90 text-sm mb-2">
        “Improving your work is the key to progress.” 🌻
      </p>

      <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          value={editTask.title}
          onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
          required
          className="border p-3 rounded"
        />

        <textarea
          name="desc"
          value={editTask.desc}
          onChange={(e) => setEditTask({ ...editTask, desc: e.target.value })}
          required
          rows={3}
          className="border p-3 rounded"
        />

        <input
          type="datetime-local"
          name="dueDate"
          value={editTask.dueDate}
          onChange={(e) => setEditTask({ ...editTask, dueDate: e.target.value })}
          className="border p-3 rounded"
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          Update
        </button>
      </form>

      <button
        onClick={() => setShowEditPopup(false)}
        className="mt-4 text-red-500 font-semibold w-full"
      >
        Close
      </button>
    </div>
  </div>
)}


      </div>
    </>
  );
}

