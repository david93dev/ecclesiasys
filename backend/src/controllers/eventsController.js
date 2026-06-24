const Event = require("../models/Event")
const Member = require("../models/Member")
const { bucket } = require("../config/firebase") // <-- Importando o bucket configurado

// Função auxiliar para fazer o upload do arquivo para o Firebase e retornar a URL pública
const uploadToFirebase = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) return resolve("")

        // Cria um nome único usando timestamp para evitar sobreposição de arquivos com o mesmo nome
        const fileName = `events/${Date.now()}_${file.originalname}`
        const blob = bucket.file(fileName)

        const blobStream = blob.createWriteStream({
            metadata: { contentType: file.mimetype }
        })

        blobStream.on("error", (error) => reject(error))

        blobStream.on("finish", async () => {
            try {
                // Torna o arquivo público na nuvem
                await blob.makePublic()
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`
                resolve(publicUrl)
            } catch (err) {
                reject(err)
            }
        })

        blobStream.end(file.buffer)
    })
}

exports.getPublicEvents = async (req, res) => {
    try {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

        // Adicionado "bannerUrl" no select das 3 buscas abaixo
        let events = await Event.find({
            date: { $gte: startOfMonth, $lt: startOfNextMonth }
        })
        .select("title description date bannerUrl") 
        .sort({ date: 1 })
        .limit(6)

        if (events.length === 0) {
            events = await Event.find({ date: { $gte: now } })
            .select("title description date bannerUrl")
            .sort({ date: 1 })
            .limit(6)
        }

        if (events.length === 0) {
            events = await Event.find()
            .select("title description date bannerUrl")
            .sort({ date: -1 })
            .limit(6)
        }

        res.set("Cache-Control", "no-store")
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json({ error: "Erro interno do servidor" })
    }
}

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
            return res.status(404).json({message: "Evento não encontrado"})
        }
        res.status(200).json(event)
    } catch (error){
        res.status(500).json({error: "Erro interno do servidor"})
    }
}

exports.createEvent = async (req, res) => {
    try{
        const { title, description, date, responsible, participants } = req.body

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

        // --- LÓGICA DO FIREBASE UPONTADA AQUI ---
        let bannerUrl = ""
        if (req.file) {
            bannerUrl = await uploadToFirebase(req.file)
        }

        // Criamos o evento mesclando os dados textuais com a URL gerada
        const event = await Event.create({
            title,
            description,
            date,
            responsible,
            participants,
            bannerUrl
        })

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
                return res.status(400).json({message: "O responsável informado não existe"})
            }
        }
        if (participants !== undefined){
            const foundParticipants = await Member.find({_id: { $in: participants}})
            if(foundParticipants.length !== participants.length){
                return res.status(400).json({message: "Um ou mais participantes não existe"})
            }
        }

        // Criamos um objeto com o que veio no body para atualizar
        const updateData = { ...req.body }

        // Se uma nova foto foi enviada no update, fazemos o upload dela
        if (req.file) {
            updateData.bannerUrl = await uploadToFirebase(req.file)
        }

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            updateData, // Passamos o updateData em vez do req.body bruto
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
        
        // [Opcional] Você pode adicionar uma lógica aqui para deletar o arquivo do Firebase 
        // usando a URL salva nele se quiser economizar espaço no Storage no futuro.

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