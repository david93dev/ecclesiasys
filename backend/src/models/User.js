const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "O nome é obrigatório"],
        trim: true,
        minlength: [3, "O mínimo de carecteres permitidas são 3"]
    },
    email: {
        type: String,
        required: [true, "O e-mail é obrigatório"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Digite um e-mail válido"]
    },
    passwordHash: {
        type: String,
        required: [true, "A senha é obrigatória"],
         }
    }, {
        timestamps: true
    })

module.exports = mongoose.model("User", userSchema)