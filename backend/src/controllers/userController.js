const User = require("../models/User")
const bcrypt = require("bcryptjs")

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

exports.createUser = async (req, res) => {
    try {

        const { name, email, password, role } = req.body

        if (!password || password.length < 6) {
            return res.status(400).json({
                message: "Senha deve ter no mínimo 6 caracteres"
            })
        }

        const userExists = await User.findOne({ email })

        if (userExists) {
            return res.status(400).json({
                message: "E-mail já cadastrado"
            })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            passwordHash,
            role
        })

        res.status(201).json({
            message: "Usuário criado com sucesso",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            error: "Erro interno do servidor"
        })
    }
}

exports.updateUser = async (req, res) => {
    try {

        const { id } = req.params
        const { name, email, password, role } = req.body

        const updateData = {}

        // ✅ só atualiza se vier valor
        if (name) {
            updateData.name = name
        }

        if (email) {
            updateData.email = email
        }

        if (role) {
            updateData.role = role
        }

        // ✅ atualiza senha somente se enviada
        if (password && password.trim() !== "") {

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

        console.log(error)

        // ✅ email duplicado
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Este e-mail já está em uso"
            })
        }

        // ✅ validações mongoose
        if (error.name === "ValidationError") {

            const errors = Object.values(error.errors)
                .map(err => err.message)

            return res.status(400).json({
                errors
            })
        }

        res.status(500).json({
            error: "Erro interno do servidor"
        })
    }
}