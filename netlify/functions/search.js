const axios = require('axios');

exports.handler = async (event) => {
    const query = event.queryStringParameters.q;

    try {
        // We are using a simpler Google link that is more "bot-friendly"
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&gbv=1&sei=1`;
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
            }
        });

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "text/html",
                "Access-Control-Allow-Origin": "*"
            },
            body: response.data
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: "Search failed. Try again in a moment."
        };
    }
};