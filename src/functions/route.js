import { app } from '@azure/functions';

// Endpoint 1: Obtener usuarios (GET)
app.http('getUsuarios', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'usuarios', // URL: /api/usuarios
    handler: async (request, context) => {
        context.log('Procesando solicitud de usuarios...');
        
        const usuarios = [
            { id: 1, nombre: 'Ana' },
            { id: 2, nombre: 'Carlos' }
        ];

        return { jsonBody: usuarios };
    }
});

// Endpoint 2: Crear usuario (POST) en el mismo archivo
app.http('createUsuario', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'usuarios', // URL: /api/usuarios
    handler: async (request, context) => {
        const body = await request.json();
        context.log(`Usuario ${body.nombre} creado.`);
        
        return { status: 201, jsonBody: { creadocónÉxito: true } };
    }
});