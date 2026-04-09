const Member = require("../models/Member")

exports.getMembers = async (req, res) => {
    try {
        const members = await Member.find()
        .populate("ecclesiasticalProfile", "baptismDate baptizedBy notes ")
        res.json(members)

    } catch (error) {
        res.status(500).json({ error: error.message})
    }
}

exports.getMemberById = async (req, res) => {
    try{
        const member = await Member.findById(req.params.id)
        .populate("ecclesiasticalProfile", "baptismDate baptizedBy notes ")
        if(!member) {
            return res.status(404).json({ message: "Membro não encontrado" })
        } 

        res.status(200).json(member)
        
    } catch (error) {
            res.status(500).json({ error: error.message})
        }
}

exports.createMember = async (req, res) => {
    try{
        const member = await Member.create(req.body)
        res.status(201).json(member)

    }catch (error) {
        if (error.code == 11000) {
            return res.status(400).json({ message: "Este e-mail já está cadastrado!"})
            
        }
        if(error.name == "ValidationError"){
            const errors = Object.values(error.errors).map(err => err.message)
            return res.status(400).json({errors})
        }
       res.status(500).json({ error:"Erro interno do servidor!"})
    }
}

exports.updateMember = async (req, res) => {
    try{
        const member = await Member.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true,
              runValidators: true
            }

        )
        if (!member){
            return res.status(404).json({message: "Membro não encontrado"})
        }
        res.status(200).json(member)
    } catch (error) {
        if(error.name == "ValidationError"){
            const errors = Object.values(error.errors).map(err => err.message)
            return res.status(400).json({errors})
        }
       res.status(500).json({ error:"Erro interno do servidor!"})
    }
}

exports.deleteMember = async (req, res) => {
    try{
        const member = await Member.findByIdAndDelete(req.params.id)

        if(!member) {
            return res.status(404).json({message: "Membro não encontrado!"})
        }
        res.status(200).json({ message: "Membro deletado com sucesso!"})
    }catch(error) {
        res.status(500).json({error: error.message})
    }
}