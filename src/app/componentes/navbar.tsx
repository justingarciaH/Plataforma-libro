"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
        }
      } catch {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login"; // redirige al login
  }

  return (
    <nav className="bg-brown-700 p-4 flex justify-between items-center">
      <div className="text-white text-2xl font-bold">
        <Link href="/">Biblioteca Justito</Link>
      </div>
      <div className="text-white flex gap-4 items-center">
        {user ? (
          <>
            <span>Bienvenido! {user.name} 👋</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Salir
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline">
              Iniciar Sesión
            </Link>
            <Link
              href="/register"
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
