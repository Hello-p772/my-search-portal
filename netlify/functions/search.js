const axios = require('axios');

exports.handler = async (event) => {
    const query = event.queryStringParameters.q || 'test';

    try {
        // We use a very basic search URL
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&gbv=1`;
        
        const response = await axios.get(url, {
            timeout: 5000, // If Google takes too long, stop trying
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebkit/537.36'
            }
        });

        if (!response.data) {
            return { statusCode: 200, body: "Google sent back an empty page." };
        }

        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "text/html",
                "Access-Control-Allow-Origin": "*" 
            },
            body: response.data
        };

    } catch (error) {
        // This will tell us if Google is blocking us or if axios is broken
        return {
            statusCode: 200, // We keep this 200 so we can see the message
            body: "Brain Error: " + error.message
        };
    }
};