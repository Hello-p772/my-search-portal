const axios = require('axios');

exports.handler = async (event) => {
  const query = event.queryStringParameters.q || 'test';
  
  try {
    // We are using the "Mobile" search link which is much harder to break
    const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(query)}&hl=en`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1'
      }
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*"
      },
      body: response.data
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "Error: Could not reach Google. " + error.message
    };
  }
};