import { app } from '@azure/functions';

app.http('raizUsuarios', {
    methods: ['GET', 'POST'], // <--- Soporta ambos métodos
    authLevel: 'anonymous',
    route: 'usuarios',
    handler: async (request, context) => {
        if (request.method === 'GET') {
            return { jsonBody: { mensaje: "Aquí devuelves todos los usuarios" } };
        }
        
        if (request.method === 'POST') {
            const body = await request.json();
            return { status: 201, jsonBody: { mensaje: "Usuario creado", data: body } };
        }
    }
});

app.http('usuariosConId', {
    methods: ['GET', 'PUT', 'DELETE'], // <--- Soporta los tres
    authLevel: 'anonymous',
    route: 'usuarios/{id}',
    handler: async (request, context) => {
        const id = request.params.id;

        switch (request.method) {
            case 'GET':
                return { jsonBody: { id, nombre: "Usuario obtenido" } };
            case 'PUT':
                return { jsonBody: { id, mensaje: "Usuario actualizado" } };
            case 'DELETE':
                return { status: 204 };
        }
    }
});