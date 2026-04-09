const Event = require("../models/Event")
const Member = require("../models/Member")

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find()
        .populate("responsible", "name email phone")
        .populate("participants", "name email phone")
        
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json({error: "Erro interno do servidor"})
    }
}

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
        .populate("responsible", "name email phone")
        .populate("participants", "name email phone")

        if(!event){
            return res.status(404).json({message: "Eventro não encontrado"})
        }
        res.status(200).json(event)
    } catch (error){
        res.status(500).json({error: "Erro interno do servidor"})
    }
}

exports.createEvent = async (req, res) => {
    try{
        const {responsible, participants} = req.body

        const responsibleExists = await Member.findById(responsible)

        if(!responsibleExists) {
            return res.status(400).json({ message: "O responsável informado não existe"})
        }

        if(participants && participants.length > 0){
            const foundParticipants = await Member.find({_id: {$in: participants}})

            if(foundParticipants.length !== participants.length){
                return res.status(400).json({ message: "Um ou mais participantes não existe"})
            }
        }

        const event = await Event.create(req.body)

        const populatedEvent = await Event.findById(event._id)
        .populate("responsible", "name email phone")
        .populate("participants", "name email phone")

        res.status(201).json(populatedEvent)

    } catch(error){
        console.log(error)
        if( error.name === "ValidationError"){
            const errors = Object.values(error.errors).map(err => err.message)
            return res.status(400).json({errors})
        }

        res.status(500).json({error: "Erro interno do servidor"})
    }
}

exports.updateEvent = async (req, res) => {
    try{
        const {responsible, participants} = req.body

        if(responsible !== undefined) {
            const responsibleExists = await Member.findById(responsible)

            if(!responsibleExists){
                return res.status(400).json({message: "O responsável infornado não existe"})
            }
        }
        if (participants !== undefined){
            const foundParticipants = await Member.find({_id: { $in: participants}})

            if(foundParticipants.length !== participants.length){
                return res.status(400).json({message: "Um ou mais participantes não exsite"})
            }
        }
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
        .populate("responsible", "name email phone")
        .populate("participants", "name email phone")

        if(!event){
            return res.status(404).json({message: "Evento não encontrado"})
        }
        res.status(200).json(event)
    } catch(error){ 

        if(error.name === "ValidationError"){
            const errors = Object.values(error.errors).map(err => err.message)
            return res.status(400).json({errors})
        }
        res.status(500).json({error: "Erro interno do servidor"})
    }
}


exports.deleteEvent = async (req, res) => {
    try{
        const event = await Event.findByIdAndDelete(req.params.id)

        if(!event){
            return res.status(400).json({message: "Evento não encontrado"})
        }
        res.status(200).json({message: "Evento deletado com sucesso"})
    } catch(error){
        res.status(500).json({error: "Erro interno do servidor"})
    }
}

exports.addParticipantToEvent = async (req, res) => {
    try {
        const {memberId} = req.body

        const event = await Event.findById(req.params.id)

        if(!event){
            return res.status(404).json({ message: "Evento não encontrado"})
        }
        
        const memberExists = await Member.findById(memberId)

        if(!memberExists){
            return res.status(400).json({message: "O participante não existe"})
        }

        const alreadyParticipants = event.participants.some(
            participants => participants.toString() === memberId
        )

        if(alreadyParticipants){
            return res.status(400).json({message: "Este membro já participa do evento"})
        }

        event.participants.push(memberId)
        await event.save()

        const updatedEvent = await Event.findById(event._id)
        .populate("responsible", "name email phone")
        .populate("participants", "name email phone")
        
        res.status(200).json(updatedEvent)

    }catch(error){
        res.status(500).json({error: "Erro interno do servidor"})
    }
}

exports.removeParticipantFromEvent = async (req, res) => {
  try {
    const { memberId } = req.body

    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ message: "Evento não encontrado" })
    }

    const participantExists = event.participants.some(
      participants => participants.toString() === memberId
    )

    if (!participantExists) {
      return res.status(400).json({ message: "Este membro não participa do evento" })
    }

    event.participants = event.participants.filter(
      participants => participants.toString() !== memberId
    )

    await event.save()

    const updatedEvent = await Event.findById(event._id)
      .populate("responsible", "name email phone")
      .populate("participants", "name email phone")

    res.status(200).json(updatedEvent)
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" })
  }
}