// expressAdapter.js
export function azureFunctionsExpress(expressApp) {
    return async (request, context) => {
        return new Promise((resolve, reject) => {
            // Recreamos la URL interna para Express
            const url = new URL(request.url);
            const pathWithQuery = url.pathname + url.search;

            // Mockear la respuesta de Node/Express para capturar los datos
            const reqMock = {
                method: request.method,
                url: pathWithQuery,
                headers: Object.fromEntries(request.headers.entries()),
                body: request.body ? await request.json().catch(() => ({})) : {},
                query: Object.fromEntries(url.searchParams.entries())
            };

            // Estructura mínima para interceptar la respuesta de Express
            let statusCode = 200;
            let responseHeaders = {};
            let responseBody = undefined;

            const resMock = {
                status: (code) => {
                    statusCode = code;
                    return resMock;
                },
                setHeader: (name, value) => {
                    responseHeaders[name.toLowerCase()] = value;
                    return resMock;
                },
                getHeader: (name) => responseHeaders[name.toLowerCase()],
                json: (data) => {
                    responseHeaders['content-type'] = 'application/json';
                    responseBody = JSON.stringify(data);
                    resolve({ status: statusCode, headers: responseHeaders, body: responseBody });
                },
                send: (data) => {
                    if (typeof data === 'object') {
                        responseHeaders['content-type'] = 'application/json';
                        responseBody = JSON.stringify(data);
                    } else {
                        responseHeaders['content-type'] = responseHeaders['content-type'] || 'text/html';
                        responseBody = data;
                    }
                    resolve({ status: statusCode, headers: responseHeaders, body: responseBody });
                },
                end: () => {
                    resolve({ status: statusCode, headers: responseHeaders, body: responseBody });
                }
            };

            // Inyectamos la petición en el router de Express
            expressApp(reqMock, resMock, (err) => {
                if (err) reject(err);
                else resolve({ status: 404, body: "Not Found por Express" });
            });
        });
    };
}