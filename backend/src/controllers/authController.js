const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

exports.register = async (req, res) => {
    try{
        const { name, email, password} = req.body

        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(400).json({message: "Este e-mail já está cadastrado"})
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            passwordHash
        })

        res.status(201).json({
            message: "Usuário cadastrado com sucesso",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch(error) {
        if(error.name === "ValidationError"){
            const errors = Object.values(error.errors).map(err => err.message)
            return res.status(400).json({errors})
        }
        res.status(500).json({error: "Erro interno do servidor "})
    }
}

exports.login = async (req, res) => {
    try{
        const {email, password} = req.body

        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"E-mail ou senha inválidos"})
        }

        const passwordIsValid = await bcrypt.compare(password, user.passwordHash)

        if(!passwordIsValid){
            return res.status(400).json({message: "E-mail ou senha inválidos"})
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        )

        res.status(200).json({
            message: "Login realizado com sucesso",
            token,
            user:{
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        res.status(500).json({error: "Erro interno do servidor"})
    }
}