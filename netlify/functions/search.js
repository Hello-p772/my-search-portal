const axios = require('axios');

exports.handler = async (event) => {
    const query = event.queryStringParameters.q;

    try {
        // This specific URL tells Google to send the simple version 
        // and avoid looping back to your own site
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&gbv=1`;
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
            }
        });

        // We clean the data slightly so Google's links don't try to open 
        // inside your small window
        let cleanHtml = response.data.replace(/href="\/search/g, 'href="https://www.google.com/search');

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "text/html",
                "Access-Control-Allow-Origin": "*"
            },
            body: cleanHtml
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: "Search failed. Please try a different word."
        };
    }
};