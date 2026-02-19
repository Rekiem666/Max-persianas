const https = require('https');

exports.handler = async (event) => {
  console.log("Petición recibida de MAX"); // Log de control
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' }, body: '' };
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => responseData += chunk);
        res.on('end', () => {
          console.log("Respuesta de Anthropic recibida"); // Log de control
          resolve(JSON.parse(responseData));
        });
      });

      req.on('error', (e) => {
        console.error("Error en HTTPS request:", e.message); // Log de error
        reject(e);
      });
      req.write(event.body);
      req.end();
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(result)
    };
  } catch (err) {
    console.error("Error capturado:", err.message); // Log de error
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
