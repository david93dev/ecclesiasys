const mongoose = require("mongoose")

const contributionSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: [true, "O membro é obrigatório"]
    },
    amount:{
        type: Number,
        required: [true, "O valor é obrigatório"],
        min: [1, "O valor deve ser maior que zero"]
    },
    type:{
        type: String,
        required: [true, "O tipo da contribuição é obrigatório"],
        enum: {
            values: ["tithe", "offering", "missions"],
            message: "O tipo deve ser: tithe, offering ou missions"
        }
    },
    date:{
        type: Date,
        required: [true, "A data é obrigatória"]
    },
     note: {
        type: String,
        trim: true,
        maxlength: [300, "A observação pode ter no máximo 300 caracteres"]
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Contribution", contributionSchema)