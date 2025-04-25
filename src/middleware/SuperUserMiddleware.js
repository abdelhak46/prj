const isSuperUser = (req, res, next) => {
    // Vérifier si l'utilisateur connecté est un superuser
    if (req.user.role !== 'superuser') {
        return res.status(403).json({
            success: false,
            message: "accès refusé, seul le superuser peut fair ca "
        });
    }
    next(); 
};

module.exports = isSuperUser;