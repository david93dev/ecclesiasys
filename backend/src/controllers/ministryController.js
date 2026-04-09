const Ministry = require("../models/Ministry")
const Member = require("../models/Member")

exports.getMinistries = async (req, res) => {
    try {
        const ministries = await Ministry.find()
        .populate("leader", "name phone email")
        .populate("members", "name phone email")

        res.status(200).json(ministries)
    } catch (error){
        res.status(500).json({error: "Erro interno do servidor"})
    }
}

exports.getMinistriesById = async (req, res) => {
    try {
        const ministry = await Ministry.findById(req.params.id)
        .populate("leader", "name phone email")
        .populate("members", "name phone email")

        if(!ministry){
            return res.status(404).json({ message: "Ministério não encontrado "})
        }
        res.status(200).json(ministry)
    } catch (error) {
        res.status(500).json({error: "Erro interno do servidor"})
    }
}

exports.createMinistry = async(req,res) => {
    try {
        const { leader, members } = req.body 
        const leaderExists = await Member.findById(leader)

        if(!leaderExists){
            return res.status(400).json({ message: "O líder informado não existe "})
        }
        if( members && members.length > 0){
            const foundMembers = await Member.find({_id: {$in: members }})

            if(foundMembers.lenght !== members.lenght){
                return res.status(400).json({message: "Um ou mais membros informados não existe"})
            }
        }

        const ministry = await Ministry.create(req.body)

        const populatedMinistry = await Ministry.findById(ministry._id)
        .populate("leader", "name phone email")
        .populate("members", "name phone email")

        res.status(201).json(populatedMinistry)
    } catch (error) {
        if(error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => err.message)
            return res.status(400).json({ errors })
        }
        res.status(500).json({error: "Erro interno do servidor"})
    }
}

exports.updateMinistry = async (req, res) => {
    try{
        const { leader, members} = req.body

        if(leader !== undefined) {
            const leaderExists = await Member.findById(leader)
            if(!leaderExists){
            return res.status(400).json({message: "O líder informado não existe"})
        }

        }

        
         if (members !== undefined){
        const foundMembers = await Member.find({_id: {$in: members} })

        if(foundMembers.length !== members.lenght){
            return res.status(400).json({ message: "Um ou mais membros informados não existe"})
        }

        }

        const ministry = await Ministry.findByIdAndUpdate(
              req.params.id,
              req.body,
              {
                new: true,
                runValidators: true
              }
        )
        .populate("leader", "name phone email")
        .populate("members", "name phone email")
          
        if(!ministry){
            return res.status(404).json({ message: "Ministério não encontrado"})
        }
        res.status(200).json(ministry)

    }catch (error){
        if(error.name === "ValidationError"){
            const errors = Object.values(error.errors).map(err => err.message)
            return res.status(400).json({errors})
        }
        res.status(500).json({error: "Erro interno do servidor"})
    }
}

exports.deleteMinistry = async (req, res) => {
    try{
        const ministry = await Ministry.findByIdAndDelete(req.params.id)

        if(!ministry) {
            return res.status(404).json({message: "Ministério não encontrado"})
        }
        res.status(200).json({ message: "Ministério deletado com sucesso"})
    }catch (error) {
        res.status(500).json({error: "Erro interno do servidor"})
    }
}

exports.addMemberToMinistry = async (req, res) => {
    try{
        const {memberId} = req.body

        const ministry = await Ministry.findById(req.params.id)

        if(!ministry){
            return res.status(404).json({ message: "Ministério não encontrado"})
        }
        const memberExists = await Member.findById(memberId)

        if(!memberExists){
            return res.status(400).json({error: "O membro informado não existe"})
        }

        const alreadyInMinistry = ministry.members.some(
            member => member.toString() === memberId
        )

        if(alreadyInMinistry){
            return res.status(400).json({message: "Este membro já pertence ao ministério"})
        }

        ministry.members.push(memberId)
        await ministry.save()

        const updatedMinistry = await Ministry.findById(ministry._id)
         .populate("leader", "name phone email")
        .populate("members", "name phone email")

        res.status(200).json(updatedMinistry)
    }catch (error) {
        res.status(500).json({error: "Erro intero de servidor"})
    }
    
}

exports.removeMemberFromMinistry  = async (req, res) => {
    try{
        const {memberId} = req.body
        const ministry = await Ministry.findById(req.params.id)

        if(!ministry){
            return res.status(404).json({message: "Ministério não encontrado"})
        }
        const memberExists = ministry.members.some(
            member => member.toString() == memberId
        )
        if(!memberExists){
            return res.status(400).json({message: "Este membro não participa do ministério"})
        }
        ministry.members = ministry.members.filter(
            member => member.toString() !== memberId

        )
        await ministry.save()

        const updatedMinistry = await Ministry.findById(ministry._id)
        .populate("leader", "name phone email")
        .populate("members", "name phone email")

        res.status(200).json(updatedMinistry)

    }catch(error){
        res.status(500).json({error: "Erro interno do servidor"})
    }
}

exports.getMinistriesMembers = async (req, res) => {
    try{
        const ministry = await Ministry.findById(req.params.id)
        .populate("leader", "name phone email")
        .populate("members", "name phone email")

        if(!ministry){
            return res.status(404).json({message: "Ministério não encontrado"})
        }

        res.status(200).json({
            ministryName: ministry.name,
            leader: ministry.leader,
            totalMembers: ministry.members.length,
            members: ministry.members
        })

    }catch (error){
        res.status(500).json({error: "Erro interno do servidor"})
    }
}
