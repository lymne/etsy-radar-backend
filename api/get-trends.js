const googleTrends = require('google-trends-api');

// This is the main function Vercel will run
module.exports = async (req, res) => {
    // Set CORS headers to allow your extension to call this function
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache for 1 hour

    // Handle pre-flight requests for CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const results = await googleTrends.dailyTrends({ geo: 'US' });
        const trendsData = JSON.parse(results);
        
        // We only want the titles of the trending topics
        const trendingTopics = trendsData.default.trendingSearchesDays[0].trendingSearches.map(trend => trend.title.query);

        // Send the clean list of topics as the response
        res.status(200).json({
            success: true,
            lastUpdated: new Date().toISOString(),
            trends: trendingTopics
        });

    } catch (error) {
        console.error('Google Trends API Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch Google Trends data.'
        });
    }
};
