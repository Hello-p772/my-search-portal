const axios = require('axios');

exports.handler = async (event) => {
    const query = event.queryStringParameters.q;

    if (!query) {
        return { statusCode: 400, body: "No query" };
    }

    try {
        // We use the 'mobile' version of Google because it's lighter and easier to proxy
        const response = await axios.get('https://www.google.com/search', {
            params: { q: query, gbv: "1" },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36'
            }
        });

        // This removes Google's "protection" that prevents it from being shown in frames
        let html = response.data;
        html = html.replace(/href="\//g, 'href="https://www.google.com/');

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "text/html",
                "Access-Control-Allow-Origin": "*",
                "X-Frame-Options": "ALLOWALL" 
            },
            body: html
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: "Error fetching results. Google might be blocking the request."
        };
    }
};