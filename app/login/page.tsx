"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { users } from "@/lib/authUsers";

export default function LoginPage() {

  const router = useRouter();

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");

  const login = () => {

  const found = users.find(
    u => u.username === username && u.password === password
  );

  if(!found){
    alert("Invalid credentials");
    return;
  }

  // clear guest data
  localStorage.clear();

  // mark logged user
  localStorage.setItem("mode","user");
  localStorage.setItem("user", username);

  router.push("/capture");
};

  const guest = () => {
    localStorage.setItem("mode","guest");
    router.push("/capture");
  };

  return (

<div className="min-h-screen bg-[#f2f2f2] text-black flex items-center justify-center">

  <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 w-[340px]">

    <h1 className="text-2xl font-semibold tracking-tight text-center mb-5">
      Login
    </h1>

    <input
      placeholder="Username"
      value={username}
      onChange={e=>setUsername(e.target.value)}
      className="
        w-full rounded-xl border border-black/10
        px-3 py-2 mb-3
        outline-none
        focus:border-black/30
        transition
      "
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={e=>setPassword(e.target.value)}
      className="
        w-full rounded-xl border border-black/10
        px-3 py-2 mb-4
        outline-none
        focus:border-black/30
        transition
      "
    />

    <button
      onClick={login}
      className="
        w-full p-3 rounded-xl
        bg-black text-white
        hover:bg-black/90 transition
        font-medium mb-2
      "
    >
      Login
    </button>

    <button
      onClick={guest}
      className="
        w-full p-3 rounded-xl
        border border-black/10
        hover:bg-black/5 transition
        text-sm
      "
    >
      Continue as Guest
    </button>

  </div>

</div>

);
}