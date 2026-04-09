const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "O título é obrigatório"],
        trim: true,
        minlength: [3, "O título deve ter pelo menos 3 caracteres"]
    },
    description: {
        type: String,
        required: [true, "A descrição é obrigatória"],
        trim: true,
        minlength: [5, "A descrição tem que conter no mínimo 3 caracteres"]
    },
    date: {
        type: Date,
        required: [true, "A data é obrigatória"]
    },
    responsible: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: [true, "O responsável do evento é obrigatório"]
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member"
        }
    ]
},
{
    timestamps: true
})

module.exports = mongoose.model("Event", eventSchema)