const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET;

const withAuth = (req, res, next) => {
    const token = req.headers["authorization"]?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Não autorizado" });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido ou expirado" });
        }

        req.email = decoded.email;
        next(); // Permite que a requisição continue
    });
};

module.exports = withAuth;
