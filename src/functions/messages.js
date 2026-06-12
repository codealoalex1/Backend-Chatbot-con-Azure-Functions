import { app } from "@azure/functions";

app.http('messages', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        const data = await request.json();
        const { nombre } = data;
        return { body: `Hello, ${nombre || "hola mundo"}!` };
    }
});
