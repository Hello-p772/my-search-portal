exports.handler = async (event) => {
    const query = event.queryStringParameters.q;

    if (!query) {
        return { statusCode: 400, body: "Please enter a search term." };
    }

    try {
        // Wikipedia API URL
        const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5&origin=*`;
        
        // Using built-in fetch instead of Axios
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data || !data.query) {
            return { 
                statusCode: 200, 
                headers: { "Content-Type": "text/html", "Access-Control-Allow-Origin": "*" },
                body: "<p style='text-align:center;'>No results found. Try a different topic!</p>" 
            };
        }

        const pages = data.query.pages;
        let htmlResults = "";
        
        Object.keys(pages).forEach(id => {
            const page = pages[id];
            htmlResults += `
                <div style="margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                    <h3 style="margin: 0; color: #007bff;">${page.title}</h3>
                    <p style="font-size: 14px; color: #444; line-height: 1.6; margin: 10px 0;">
                        ${page.extract ? page.extract.substring(0, 300) + '...' : 'No summary available.'}
                    </p>
                    <a href="https://en.wikipedia.org/?curid=${page.pageid}" target="_blank" style="color: #007bff; font-weight: bold; text-decoration: none; font-size: 13px;">Read full article →</a>
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
        console.error(error);
        return { 
            statusCode: 200, // Keep 200 to show the error message on screen
            body: "The search engine is having a moment. Please refresh and try again." 
        };
    }
};