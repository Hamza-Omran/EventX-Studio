module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    res.status(200).json({
        message: "API is working",
        path: req.url,
        method: req.method,
        env: {
            MONGO_URI: process.env.MONGO_URI ? "set" : "NOT SET",
            JWT_SECRET: process.env.JWT_SECRET ? "set" : "NOT SET"
        },
        timestamp: new Date().toISOString()
    });
};
