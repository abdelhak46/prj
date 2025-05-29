const isAccept = (req, res, next) => {
    // Vérifier si le username contient un espace
    const { username } = req.body;

    if (typeof username !== 'string') {
        return res.status(400).json({
            success: false,
            message: "username est requis et doit être une chaine de caractères"
        });
    }

    const test = username.includes(' ');

    if (test) {
        return res.status(400).json({
            success: false,
            message: "Username refusé, espace interdit"
        });
    }

    next();
};

module.exports = isAccept;