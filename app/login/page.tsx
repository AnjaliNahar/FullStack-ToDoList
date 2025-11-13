"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (!email) {
      toast.error("Email is required!");
      return;
    }
    localStorage.setItem("user", email);
    toast.success("Login successful!");
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen  bg-[url('/board-bg.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="bg-white  p-8 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-indigo-500 text-white py-2 rounded-lg"
        >
          Login
        </button>
      </div>
    </div>
  );
}
