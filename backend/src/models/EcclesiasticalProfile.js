const mongoose = require("mongoose")

const ecclesiasticalProfileSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: [true, "O membro é obrigatório"],
        unique: true,
    },
    baptismDate: {
        type: Date
    },
    baptizedBy:{
        type: String,
        trim: true,
        maxlenght: [100, "O nome de quem batizou deve conter no máximo 100 caracteres"]
    },
    membershipDate: {
        type: Date
    },
    membershipOrigin:{
        type: String,
        trim: true,
        maxlenght: [150, "A origem da membresia pode ter no máximo 150 caracteres"]
    },
    c: {
        type: String,
        trim: true,
        maxlength: [500, "As observações devem conter no máximo 500 caracteres"]
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("EcclesiasticalProfile", ecclesiasticalProfileSchema)