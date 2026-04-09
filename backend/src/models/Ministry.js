const mongoose = require("mongoose")

const ministrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "O nome do ministério é obrigatório"],
        trim: true,
        minlength: [3, "O nome do ministério deve conter no mínimo 3 caracteres"]
    },
    description: {
        type: String,
        required: [true, "A descrição é obrigatória"],
        trim: true,
        minlength: [3, "A descrição deve conter no mínimo 3 caracteres"]
    },
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: [true, "O líder do ministério é obrigatório"]
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",

        }
    ],
    status: {
        type: String,
        enum: {
            values: ["active", "inactive"],
            message: "O status deve ser active ou inactive"
        },
        default: "active"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Ministry", ministrySchema)