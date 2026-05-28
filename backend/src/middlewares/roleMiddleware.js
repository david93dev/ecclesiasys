const normalizeRole = (role) => {
    const normalizedRole = String(role || "").trim().toLowerCase()

    if (normalizedRole === "administrador") {
        return "admin"
    }

    return normalizedRole
}

module.exports = function(roles = []) {

    return (req, res, next) => {

        const userRole = normalizeRole(req.user.role)

        if(!roles.includes(userRole)){
            return res.status(403).json({
                error: "Acesso negado"
            })
        }

        next()
    }
}
