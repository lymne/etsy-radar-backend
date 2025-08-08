const axios = require('axios');
const cheerio = require('cheerio');

// The public URL for Google's daily trending searches page
const TRENDS_URL = 'https://trends.google.com/trends/trendingsearches/daily?geo=US';

// This is the main function Vercel will run
module.exports = async (req, res) => {
    // Set headers for CORS and caching
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Cache-Control', 's-maxage=43200, stale-while-revalidate'); // Cache for 12 hours

    // Handle pre-flight requests for CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // Step 1: Fetch the HTML of the public Google Trends page
        const { data } = await axios.get(TRENDS_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
            }
        });

        // Step 2: Load the HTML into Cheerio for parsing
        const $ = cheerio.load(data);

        // Step 3: Find and extract the trend titles
        const trendingTopics = [];
        $('.feed-list-wrapper').each((i, list) => {
            $(list).find('.feed-item').each((j, item) => {
                const title = $(item).find('.title a').text().trim();
                if (title) {
                    trendingTopics.push(title);
                }
            });
        });

        if (trendingTopics.length === 0) {
            throw new Error("Could not find any trending topics on the page.");
        }

        // Step 4: Send a successful response
        res.status(200).json({
            success: true,
            source: "Live Google Trends HTML Scrape on Vercel",
            lastUpdated: new Date().toISOString(),
            trends: trendingTopics.slice(0, 20)
        });

    } catch (error) {
        console.error('Scraping Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to scrape Google Trends data.',
            details: error.message
        });
    }
};
