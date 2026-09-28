const jwt = require('jsonwebtoken')

const getUserId = (res, key) => {
    try {
        const token = res.getHeaders().jwt;

        if (token) {
            const decoded = jwt.verify(token, key);

            return decoded.i;
        }
    }
    catch {}
    return 0;
}

module.exports = getUserId;