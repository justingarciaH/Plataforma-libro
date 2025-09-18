//entrada de frontend de login
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { FaUser, FaLock } from "react-icons/fa";

export default function LoginPage() {
    const router = useRouter();
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ error, setError ] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');//para limpiar errores previos

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include', // para manejar cookies
        });
        const data = await res.json();
        if (res.ok) {
          window.location.href = "/";  // en vez de router.push
        } else {
            setError(data.error || 'Error en el login');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
            <div className="w-[800px] h-[500px] overflow-hidden bg-gray-900 rounded-2xl shadow-lx  md:flex border border-cyan-400 border-opacity-30">
                
                {/* Contenedor del formulario - Lado izquierdo */}
                <div className="w-1/2 p-10 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-8 text-center text-cyan-400">Login</h2>
                    <form onSubmit={handleLogin} className="space-y-6">
                        
                        {/* Campo de Username/Email */}
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 rounded-full border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400 pl-12"
                                required
                            />
                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>

                        {/* Campo de Password */}
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 rounded-full border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400 pl-12"
                                required
                            />
                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>

                        {error && <p className="text-red-500 text-center">{error}</p>}
                        
                        {/* Botón de Login */}
                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold transition-transform transform hover:scale-105"
                        >
                            Login
                        </button>
                    </form>
                    
                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-400">No tienes una cuenta?</span>{' '}
                        <a href="/register" className="text-cyan-400 font-semibold hover:underline">Regístrate</a>
                    </div>
                </div>

                {/* Contenedor del mensaje de bienvenida - Lado derecho */}
                <div className="w-1/2 bg-gradient-to-br from-cyan-700 to-blue-900 text-white p-10 flex flex-col justify-center items-center text-center">
                    <h1 className="text-4xl font-bold mb-4">BIENVENIDO!</h1>
                    <p className="text-gray-200 text-lg">Profe ya bajele a los tps</p>
                </div>

            </div>
        </div>
    );
};
