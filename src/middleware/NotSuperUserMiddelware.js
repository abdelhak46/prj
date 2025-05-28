const isNotSuperUser = (req, res, next) => {
    // Vérifier si l'utilisateur connecté est pas superuser
    if (req.user.role == 'superuser') {
        return res.status(403).json({
            success: false,
            message: "accès refusé,  le superuser ne peut fair ca "
        });
    }
    next(); 
};

module.exports =isNotSuperUser;