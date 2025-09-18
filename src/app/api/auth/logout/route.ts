import { NextResponse } from 'next/server';

//interfaz que servira para eliminar el token de las cookies
export async function POST() {

    const response = NextResponse.json({ message: 'Logout exitoso' }, { status: 200 })
    response.cookies.delete('token');
    return response;
}