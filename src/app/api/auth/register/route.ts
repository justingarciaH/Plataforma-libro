// archivo de entrada para el registro 
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "@/db/db";
import { User } from '@/app/tipos/libro';
import { hash } from 'bcryptjs';
import { z } from 'zod';


const registerSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2).max(100),
    password: z.string().min(6).max(100),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log("Datos recibidos:", body);

        const { name, email, password } = registerSchema.parse(body);

        const db = await connectDB();
        const existingUser = db.collection('users'); // para verificar si ya esta el usuario en la BD

        // verificamos si el usuario ya existe
        const user = await existingUser.findOne({ email });
        if (user) {
            return NextResponse.json({ error: 'El usuario ya existe' }, { status: 400 });
        }

        // hashear contraseña
        const hashedPassword = await hash(password, 10);

        const newUser: Omit<User, '_id'> = {
            email,
            name,
            password: hashedPassword,
            createdAt: new Date(),
        };

        const result = await existingUser.insertOne(newUser);
        return NextResponse.json({ message: 'Usuario registrado con éxito', _id: result.insertedId }, { status: 201 });  

    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Errores de Zod:", error.issues);
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }   
       return NextResponse.json({ error: 'Error en el registro de usuario'}, { status: 400 });
    }
}