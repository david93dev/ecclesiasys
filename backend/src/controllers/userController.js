const User = require("../models/User")

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-passwordHash")

        res.status(200).json({
            message: "Usuários encontrados com sucesso",
            users
        })

    } catch (error) {
        res.status(500).json({
            error: "Erro interno do servidor"
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        const user = await User.findByIdAndDelete(id)

        if (!user) {
            return res.status(404).json({
                message: "Usuário não encontrado"
            })
        }

        res.status(200).json({
            message: "Usuário deletado com sucesso"
        })

    } catch (error) {
        res.status(500).json({
            error: "Erro interno do servidor"
        })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { name, email, password, role } = req.body

        const updateData = {
            name,
            email,
            role
        }

        // Atualiza a senha apenas se ela for enviada
        if (password) {
            const passwordHash = await bcrypt.hash(password, 10)
            updateData.passwordHash = passwordHash
        }

        const user = await User.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).select("-passwordHash")

        if (!user) {
            return res.status(404).json({
                message: "Usuário não encontrado"
            })
        }

        res.status(200).json({
            message: "Usuário atualizado com sucesso",
            user
        })

    } catch (error) {

        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => err.message)

            return res.status(400).json({
                errors
            })
        }

        res.status(500).json({
            error: "Erro interno do servidor"
        })
    }
}