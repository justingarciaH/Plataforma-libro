"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link";
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa'; 

export default function RegisterPage() {
    const router = useRouter();
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    // const [confirmPassword, setConfirmPassword] = useState("");
    const [ name, setName ] = useState('');
    const [ error, setError ] = useState('');
    const [loading, setLoading] = useState(false);


    const handleSubmit= async (e: React.FormEvent) =>{
        e.preventDefault();
        setError('');
        // if(password !== confirmPassword) {
        //     setError("Las contraseñas no coinciden");
        //     return;
        // }
        // setLoading(true);

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password,  name })
        });
        
        const data = await res.json();
        setLoading(false);
        if(res.ok) {
            router.push('/login'); //para redirigir al login despues de un registro exitoso
        } else {
            setError(data.message || 'Error en el registro');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-950">
            
            {/* Contenedor del formulario con degradado y sombra */}
            <div className="relative w-full max-w-4xl overflow-hidden text-gray-200 bg-gray-900 rounded-lg shadow-xl md:flex border border-cyan-400 border-opacity-30">
           
                {/* Sección de bienvenida con el degradado angular */}
            <div className="hidden md:flex w-1/2 relative bg-gradient-to-br from-cyan-500 to-blue-900 via-sky-600">
                    <div className="absolute top-0 left-0 w-full h-full transform -skew-x-12 origin-top-left -translate-x-1/10 -z-10"></div>
                    <div className="relative z-20 flex flex-col justify-center items-center p-25 text-center">
                         <h1 className="text-5xl font-extrabold mb-4 animate-fade-in">Bienvenido!</h1>
                         <p className="text-xl animate-fade-in delay-150">Por favor ingrese sus credenciales <br/> Pedazo de muelto</p>
                    </div>
                </div>

                {/* Contenedor del formulario de registro */}
               <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-gray-900 z-10">
                    <h2 className="text-4xl font-extrabold text-white mb-6">Registrate</h2>
                    
                    {error && <p className="text-red-400 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Campo de nombre de usuario */}
                        <div className="relative border-b-2 border-gray-600 focus-within:border-cyan-400">
                            <input
                                type="text"
                                placeholder=""
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full text-white bg-transparent outline-none pt-4 peer placeholder-transparent"
                            />
                            <label className="absolute -top-3 left-0 text-gray-400 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-cyan-400 peer-focus:text-sm">
                                Username
                            </label>
                            <span className="absolute right-0 top-3 text-cyan-400 drop-shadow-md">
                                <FaUser />
                            </span>
                        </div>

                        {/* Campo de email */}
                        <div className="relative border-b-2 border-gray-600 focus-within:border-cyan-400">
                            <input
                                type="email"
                                placeholder=""
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full text-white bg-transparent outline-none pt-4 peer placeholder-transparent"
                            />
                            <label className="absolute -top-3 left-0 text-gray-400 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-cyan-400 peer-focus:text-sm">
                                Email
                            </label>
                            <span className="absolute right-0 top-3 text-cyan-400 drop-shadow-md">
                                <FaEnvelope />
                            </span>
                        </div>


                        {/* Campo de contraseña */}
                        <div className="relative border-b-2 border-gray-600 focus-within:border-cyan-400">
                            <input
                                type="password"
                                placeholder=""
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full text-white bg-transparent outline-none pt-4 peer placeholder-transparent"
                            />  
                            <label className="absolute -top-3 left-0 text-gray-400 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-cyan-400 peer-focus:text-sm">
                                Password
                            </label>
                            <span className="absolute right-0 top-3 text-cyan-400 drop-shadow-md">
                                <FaLock />
                            </span>
                        </div>

                        {/* Campo de confirmar contraseña */}
                        {/* <div className="relative border-b-2 border-gray-600 focus-within:border-cyan-400">
                            <input
                                type="password"
                                placeholder=""
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full text-white bg-transparent outline-none pt-4 peer placeholder-transparent"
                            /> 
                            <label className="absolute -top-3 left-0 text-gray-400 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-cyan-400 peer-focus:text-sm">
                                Confirm Password
                            </label>
                            <span className="absolute right-0 top-3 text-cyan-400 drop-shadow-md">
                                <FaLock />
                            </span>  
                        </div> */}

                        {/* Botón de registro */}           
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3 mt-8 text-lg font-bold text-white transition duration-300 rounded-full bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
                        >
                            { loading ? 'Registrando...' : 'Registrarse' }                            
                        </button>
                    </form>
                    <div className="mt-8 text-center text-gray-400">
                        Ya tienes una cuenta? <Link href="/login" className="text-cyan-400 hover:underline">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}