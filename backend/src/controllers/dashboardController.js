const Contribution = require("../models/Contribution")
const Member = require("../models/Member")
const Event = require("../models/Event")

exports.getDashboard = async (req, res) => {
    try{
        const totalMembers = await Member.countDocuments()
        const membersActive = await Member.countDocuments({active: true})
    
        const startMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
         const newMembers = await Member.countDocuments({
            createdAt: { $gte: startMonth }
            });
        const totalEventsMonth = await Event.countDocuments({
            date: { $gte: startMonth}
        })
        const totalMonth = await Contribution.aggregate([
        {
            $match: {
            date: { $gte: startMonth }
            }
        },
        {
         $group: {
            _id: "$type",
            total: { $sum: "$amount" }
            }
        }

        ]);

        const tithes = totalMonth.find(item => item._id === "tithe")?.total || 0;
        const offers = totalMonth.find(item => item._id === "offer")?.total || 0;

        const totalAmount = tithes + offers;

        res.json({
            members: {
                total: totalMembers,
                active: membersActive,
                new: newMembers
            },
            events: {
                month: totalEventsMonth
            },
            contribution: {
                totalMonth: totalAmount,
                tithes,
                offers
            }
        });

    }catch (error) {
        res.status(500).json({error: "Erro interno do servidor"})
    }
    
}