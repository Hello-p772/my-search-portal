exports.handler = async (event) => {
    const query = event.queryStringParameters.q;

    // Check if the user actually typed something
    if (!query) {
        return { 
            statusCode: 400, 
            body: "Please enter a search term." 
        };
    }

    try {
        // Wikipedia Search API URL
        // &gsrlimit=5 gives us the top 5 results
        // &origin=* is vital for letting the browser see the data
        const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5&origin=*`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        // If Wikipedia finds nothing
        if (!data || !data.query) {
            return { 
                statusCode: 200, 
                headers: { 
                    "Content-Type": "text/html", 
                    "Access-Control-Allow-Origin": "*" 
                },
                body: "<p style='text-align:center; padding:20px;'>No results found. Try a different topic!</p>" 
            };
        }

        const pages = data.query.pages;
        let htmlResults = "";
        
        // Loop through the pages found and build the HTML
        Object.keys(pages).forEach(id => {
            const page = pages[id];
            htmlResults += `
                <div style="margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                    <h3 style="margin: 0; color: #007bff; font-family: sans-serif;">${page.title}</h3>
                    <p style="font-size: 14px; color: #444; line-height: 1.6; margin: 10px 0; font-family: sans-serif;">
                        ${page.extract ? page.extract.substring(0, 250) + '...' : 'No summary available.'}
                    </p>
                    <a href="#" 
                       class="wiki-link" 
                       data-id="${page.pageid}" 
                       style="color: #007bff; font-weight: bold; text-decoration: none; font-size: 13px; font-family: sans-serif;">
                       Read full article inside portal →
                    </a>
                </div>
            `;
        });

        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "text/html", 
                "Access-Control-Allow-Origin": "*" 
            },
            body: htmlResults
        };

    } catch (error) {
        console.error("Brain Error:", error);
        return { 
            statusCode: 200, 
            body: "<p style='color:red;'>The search engine is having a moment. Please refresh and try again.</p>" 
        };
    }
};