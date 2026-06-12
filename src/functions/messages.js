const { app } = require('@azure/functions');

app.http('messages', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        const name = "alex";
        return { body: `Hello, ${name}!` };
    }
});
