const Contribution = require("../models/Contribution")
const Member = require("../models/Member")

exports.getContributions = async (req, res) => {
    try{
        const contributions = await Contribution.find()
        .populate("member", "name email phone")

        res.status(200).json(contributions)
    }catch(error){
        res.status(500).json({error: "Erro interno do servidor"})
    }
}

exports.getContributionsById = async (req, res) => {
    try{
        const contribution = await Contribution.findById(req.params.id)
        .populate("member", "name email phone")

        if(!contribution){
            return res.status(404).json({message: "Contribuição não econtrada"})
        }
        res.status(200).json(contribution)
    } catch (error){
        res.status(500).json({error: "Erro interno do servidor"})
    }
}

exports.createContribution = async (req, res) => {
    try{
        const {member} = req.body 
        const memberExists = await Member.findById(member)

        if(!memberExists){
            return res.status(400).json({message: "O membro informado não existe"})
        }
        const contribution = await Contribution.create(req.body)

        const populatedContribution = await Contribution.findById(contribution._id)
        .populate("member", "name email phone")

        res.status(201).json(populatedContribution)
        } catch(error){
            if(error.name === "ValidationError"){
                const errors = Object.values(error.errors).map(err => err.message)
                return res.status(400).json({errors})
            }
            res.status(500).json({error: "Erro interno do servidor"})
        }
}

exports.updateContribution = async (req,res) => {
    try{
        const {member} = req.body
        if(member !== undefined){
            const memberExists = await Member.findById(member)

            if(!memberExists){
                return res.status(400).json({message: "O membro informado não existe"})
            }
        }
        const contribution = await Contribution.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ). populate("member", "name email phone")

        if(!contribution){
            return res.status(404).json({ message: "Contribuição não encontrada"})
        }
        res.status(200).json(contribution)
    } catch (error){
        if(error.name === "ValidationError"){
            const errors = Object.values(error.errors).map(err => err.message)
            return res.status(400).json({errors})
        }
        
        res.status(500).json({error: "Erro interno do servidor"})
    }
}

exports.deleteContribution = async( req, res) => {
    try{
        const contribution = await Contribution.findByIdAndDelete(req.params.id)

        if(!contribution){
            return res.status(404).json({message: "Contribuição não encontrada"})
        }
        res.status(200).json({message: "Contribuição deletada com sucesso"})
    }catch (error){
        res.status(500).json({error: "Erro interno do servidor"})
    }
}

