const axios = require('axios');

module.exports = async (req, res) => {
    const { q } = req.query;
    try {
        const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(q)}`);
        res.status(200).send(response.data);
    } catch (error) {
        res.status(500).send("Search failed.");
    }
};