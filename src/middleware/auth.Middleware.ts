import { NextResponse, type NextRequest } from "next/server";
import jwt from 'jsonwebtoken';

export function authMiddleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (!token)  {
        // return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        if (request.nextUrl.pathname.startsWith('/api/')) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET!);
        return NextResponse.next();
    } catch {
        // return NextResponse.json({ error: 'Token invalido' }, { status: 401 });
        if (request.nextUrl.pathname.startsWith("/api")) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

// Helper para tests y lógica de usuario extraído del token
export function getUserFromRequest(request: { cookies: { get: (name: string) => { value: string } | undefined } }, secret: string) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
        throw new Error('No autenticado');
    }
    try {
        const user = jwt.verify(token, secret);
        // Si el token es válido, retorna el usuario decodificado
        return typeof user === 'object' ? user : {};
    } catch {
        throw new Error('Token inválido');
    }
}

    //chequeamos las rutas que queremos proteger
    export const config = {
    // en este caso la de la resena
      matcher: ['/perfil', '/book/:id/review', '/book/:id/review/*'],
    };