exports.handler = async (event) => {
    const query = event.queryStringParameters.q;

    if (!query) {
        return { statusCode: 400, body: "No query provided." };
    }

    try {
        const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5&origin=*`;
        
        // We use globalThis.fetch to ensure Netlify finds the built-in fetch command
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Wikipedia responded with status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data || !data.query) {
            return { 
                statusCode: 200, 
                headers: { "Content-Type": "text/html", "Access-Control-Allow-Origin": "*" },
                body: "<p style='text-align:center;'>No results found. Try another word.</p>" 
            };
        }

        const pages = data.query.pages;
        let htmlResults = "";
        
        Object.keys(pages).forEach(id => {
            const page = pages[id];
            htmlResults += `
                <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px; font-family: sans-serif;">
                    <h3 style="margin: 0; color: #007bff;">${page.title}</h3>
                    <p style="font-size: 14px; color: #444;">${page.extract ? page.extract.substring(0, 200) + '...' : ''}</p>
                    <a href="#" class="wiki-link" data-id="${page.pageid}" style="color: #007bff; font-weight: bold; text-decoration: none;">Read More inside portal →</a>
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
        // This is the Safety Net: It sends the error to your screen instead of a white page
        return { 
            statusCode: 200, 
            headers: { "Content-Type": "text/html" },
            body: `<div style="color:red; padding:20px;"><strong>Brain Error:</strong> ${error.message}</div>` 
        };
    }
};