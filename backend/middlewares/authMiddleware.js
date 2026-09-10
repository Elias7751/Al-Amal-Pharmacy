const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ success: false, message: 'No token provided' });

    const token = authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
    if (!token) return res.status(403).json({ success: false, message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ success: false, message: 'Unauthorized' });
        req.user = decoded; // Contains id, role, etc.
        next();
    });
};

const verifyAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Require Admin Role' });
    }
    next();
};

module.exports = { verifyToken, verifyAdmin };
