const axios = require('axios');

exports.handler = async (event, context) => {
    const query = event.queryStringParameters.q;

    try {
        const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
        
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "text/html",
                "Access-Control-Allow-Origin": "*" 
            },
            body: response.data,
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Search failed" }),
        };
    }
};