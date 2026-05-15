exports.handler = async (event) => {
    const query = event.queryStringParameters.q;

    if (!query) {
        return { statusCode: 200, body: "Please enter a search term." };
    }

    try {
        const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5&origin=*`;
        
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
                <div class="result-item">
                    <h3>${page.title}</h3>
                    <p>${page.extract ? page.extract.substring(0, 250) + '...' : 'No summary available.'}</p>
                    <a href="https://en.wikipedia.org/?curid=${page.pageid}" target="_blank">Read full article on Wikipedia →</a>
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
            headers: { "Content-Type": "text/html" },
            body: `<p style="color:red;">Error: ${error.message}</p>` 
        };
    }
};