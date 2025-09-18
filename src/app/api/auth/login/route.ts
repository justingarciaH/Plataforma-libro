import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "@/db/db";
import { z } from 'zod';
import { compare }  from 'bcryptjs';
import jwt from 'jsonwebtoken';


const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = loginSchema.parse(body);
        const db = await connectDB();
        const usersCollection = db.collection('users');
    
        const user = await usersCollection.findOne({ email })
        if (!user) return NextResponse.json({ error: 'Usuario no encontrado o invalido' }, { status: 401 });

        const validPassword = await compare(password, user.password);
        if (!validPassword) return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });

        //generamos un JWT
        const token = jwt.sign( {
            id: user._id,
            email: user.email,
            name: user.name
        }, process.env.JWT_SECRET!, { expiresIn: '7d' } );

        //guardar el token en una cookie httpOnly
        const response = NextResponse.json({ message: 'Login exitoso' , token}, { status: 200 });
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60, // 7 dias
        });
        return response;
        
    } catch {
         return NextResponse.json({ error: 'Error en el login de usuario'}, { status: 400 });
    }
}