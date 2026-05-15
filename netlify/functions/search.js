const axios = require('axios');

exports.handler = async (event) => {
    const query = event.queryStringParameters.q;

    try {
        // Using DuckDuckGo's "HTML" version - it's much more reliable for portals
        const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
            }
        });

        // Fix the links so they work in your portal
        let html = response.data.replace(/href="\//g, 'href="https://duckduckgo.com/');

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "text/html",
                "Access-Control-Allow-Origin": "*"
            },
            body: html
        };
    } catch (error) {
        return {
            statusCode: 200, // Keep 200 so we can read the message
            body: "Search is currently busy. Error: " + error.message
        };
    }
};