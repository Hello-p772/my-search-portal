I've got you! This is the complete, high-performance version of search.js.

I have added the "User-Agent" (to pretend we are a human browsing) and the "headers" (to make sure the data travels safely to your website).

Copy and Paste this into netlify/functions/search.js:
JavaScript
const axios = require('axios');

exports.handler = async (event, context) => {
    // 1. Grab the search word from the URL
    const query = event.queryStringParameters.q;

    if (!query) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "No search query provided" }),
        };
    }

    try {
        // 2. Ask Google for the results while pretending to be a real Chrome browser
        const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });

        // 3. Send the Google HTML back to your website
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "text/html",
                "Access-Control-Allow-Origin": "*" // Allows your site to read the data
            },
            body: response.data,
        };
    } catch (error) {
        console.error("Search Error:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch search results from Google" }),
        };
    }
};