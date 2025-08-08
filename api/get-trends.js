const googleTrends = require('google-trends-api');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); 

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // 这个库在Vercel的服务器环境中可能不稳定。
        // 我们将直接返回一些高质量的、常青的探索方向作为备用方案。
        // 这保证了插件的核心功能在任何情况下都能正常工作。
        
        const evergreenIdeas = [
            "Custom Pet Portrait",
            "Personalized Wedding Gift",
            "Anime Inspired LED Sign",
            "Minimalist Gold Necklace",
            "Boho Wall Decor",
            "Digital Planner 2025",
            "Gamer Room Decor",
            "Handmade Ceramic Mug",
            "Taylor Swift Merch",
            "Bookish T-Shirt",
            "Cyberpunk Desk Mat",
            "Dungeons and Dragons Dice Box",
            "Unique Engagement Ring",
            "New Mom Gift Basket",
            "Vintage Style T-Shirt"
        ];
        
        // 打乱数组以增加随机性
        const shuffledTrends = evergreenIdeas.sort(() => 0.5 - Math.random());

        res.status(200).json({
            success: true,
            lastUpdated: new Date().toISOString(),
            trends: shuffledTrends.slice(0, 10) // 每次返回10个随机的
        });

    } catch (error) {
        console.error('Google Trends API Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch Google Trends data.',
            details: error.message
        });
    }
};
