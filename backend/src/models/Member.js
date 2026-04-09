const mongoose = require("mongoose")

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "O nome é obrigatório"],
        trim: true,
        minlength: [3, "O nome deve ter pelo menos 3 caracteres"]
    },
    email: { 
        type: String, 
        required: [true, "O e-mail é obrigatório"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Digite um e-mail válido"]
     },
    phone: {
        type: String,
        required: [true, "Telefone é obrigatório"],
        trim: true,
        minlength: [8, "O telefone deve ter pelo menos 8 caracteres"]
        
    },

    birthDate: {
        type: Date
     },

    status: {
        type: String,
        enum: { values: ["active", "inactive"],
            message: "O status deve ser active ou inactive"
         },
        default: "active"
    },
    ministries: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ministry"
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    ecclesiasticalProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EcclesiasticalProfile"
    }
})

module.exports = mongoose.model("Member", memberSchema)
