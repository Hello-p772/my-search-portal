const axios = require('axios');

exports.handler = async (event) => {
    const query = event.queryStringParameters.q;

    try {
        // We use a specific Google URL that is easier to load in an iframe
        const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&gbv=1`;
        
        const response = await axios.get(googleUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
            }
        });

        // This line is the "Magic": it fixes Google's internal links so they don't loop back to you
        let formattedContent = response.data.replace(/href="\/search/g, 'href="https://www.google.com/search');

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "text/html",
                "Access-Control-Allow-Origin": "*"
            },
            body: formattedContent
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: "The search engine is sleepy. Please try again in 10 seconds."
        };
    }
};