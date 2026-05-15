const axios = require('axios');

exports.handler = async (event) => {
    const query = event.queryStringParameters.q;

    try {
        // Wikipedia's official API - Fast, free, and NO CAPTCHAS
        const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5`;
        
        const response = await axios.get(url);
        const pages = response.data.query.pages;
        
        // Let's turn that data into nice HTML for your portal
        let htmlResults = `<h2>Results for "${query}"</h2>`;
        
        Object.keys(pages).forEach(id => {
            const page = pages[id];
            htmlResults += `
                <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                    <h3>${page.title}</h3>
                    <p>${page.extract ? page.extract.substring(0, 200) + '...' : 'No summary available.'}</p>
                    <a href="https://en.wikipedia.org/?curid=${page.pageid}" target="_blank" style="color: #007bff;">Read more on Wikipedia</a>
                </div>
            `;
        });

        return {
            statusCode: 200,
            headers: { "Content-Type": "text/html", "Access-Control-Allow-Origin": "*" },
            body: htmlResults
        };
    } catch (error) {
        return {
            statusCode: 200,
            body: "<h3>No results found. Try a different word!</h3>"
        };
    }
};