const EcclesiasticalProfile = require("../models/EcclesiasticalProfile")
const Member = require("../models/Member")

exports.getProfiles = async (req, res) => {
    try {
        const profiles = await EcclesiasticalProfile.find()
        .populate("member", "name email phone status")

        res.status(200).json(profiles)
    } catch (error) {
        res.status(500).json({error: "Erro interno do servidor"})
    }
}

exports.getProfileById = async (req, res) => {
    try{
        const profile = await EcclesiasticalProfile.findById(req.params.id)
         .populate("member", "name email phone status")

        if(!profile){
            res.status(404).json({message: "Nenhum perfil foi encontrado"})
        }

        res.status(200).json(profile)
    } catch (error){
        res.status(500).json({error: "Erro interno do servidor"})
    }
}

exports.getProfileByMemberId = async (req, res) => {
    try {
        const profile = await EcclesiasticalProfile.findOne({member: req.params.memberId})
        .populate("member", "name email phone status")

        if(!profile) {
            return res.status(404).json({message: "Perfil não encontrado para esse membro"})
        }
        res.status(200).json(profile)
    } catch (error){
        res.status(500).json({error: "Erro interno de servidor"})
    }
}

exports.createProfile = async (req, res) => {
    try{
        const {member} = req.body
        const memberExists = await Member.findById(member)

        if(!memberExists){
            return res.status(400).json({message: "O membro informado não existe"})
        }
        const existingProfile = await EcclesiasticalProfile.findOne({member})

        if(existingProfile){
            return res.status(500).json({message: "Este membro já possui perfil ecles."})
        }
        const profile = await EcclesiasticalProfile.create(req.body)
        await Member.findByIdAndUpdate(member, {ecclesiasticalProfile: profile._id})
        
        const populatedProfile = await EcclesiasticalProfile.findById(profile._id)
        .populate("member", "name email phone status")

        res.status(201).json(populatedProfile)

    }catch(error){
        if (error.name === "ValidationError"){
            const errors = Object.values(error.errors).map(err => err.message)
            return res.status(400).json({errors})
        }

        if(error.code === 11000){
            return res.status(400).json({message: "Este membro já possui perfil ecles."})
        }

        res.status(500).json({error: "Erro interno do servidor"})
    }
}

exports.updateProfile = async (req, res) => {
    try{
        const {member} = req.body

        if(member !== undefined){
            const memberExists = await Member.findById(member)

            if(!memberExists){
                return res.status(400).json({message: "O membro informado não existe"})
            }
        }

        const profile = await EcclesiasticalProfile.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate("member", "name email phone status")

        if(!profile){
            return res.status(404).json({message: "Perfil ecles. não encontrado"})
        }

        res.status(200).json(profile)

    } catch(error){
        if(error.name === "ValidationError"){
            const errors = Object.values(error.errors).map(err => err.message)
                return res.status(400).json({errors})
            
        }

        if(error.code === 11000){
            return res.status(400).json({message: "Este membro já possui perfil ecles."})
        }

        res.status(500).json({error: "Erro interno do servidor"})
    }
}


exports.deleteProfile = async (req, res) => {
    try {
        const profile = await EcclesiasticalProfile.findByIdAndDelete(req.params.id)

        if(!profile){
            return res.status(404).json({message: "Perfil ecles. não encontrado"})
        }

        res.status(200).json({message: "Perfil ecles. deletado com sucesso"})

    } catch(error) {
        res.status(500).json({error: "Erro interno do servidor"})
    }
}