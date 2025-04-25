const isProf = (req, res, next) => {
    // Vérifier si l'utilisateur connecté est un prof
    if (req.user.role !== 'prof') {
        return res.status(403).json({
            success: false,
            message: "accès refusé, seul le superuser peut fair ca "
        });
    }
    next(); 
};
module.exports = isProf;