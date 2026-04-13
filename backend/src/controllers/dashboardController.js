const Contribution = require("../models/Contribution");
const Member = require("../models/Member");
const Event = require("../models/Event");

exports.getDashboard = async (req, res) => {
    try {
        const startMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

     
        const [
            totalMembers,
            membersActive,
            newMembers,
            totalEventsMonth,
            totalMonth
        ] = await Promise.all([
            Member.countDocuments(),
            Member.countDocuments({ active: true }),
            Member.countDocuments({ createdAt: { $gte: startMonth } }),
            Event.countDocuments({ date: { $gte: startMonth } }),
            Contribution.aggregate([
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
            ])
        ]);

       
        const tithes = totalMonth.find(item => item._id === "tithe")?.total || 0;
        const offers = totalMonth.find(item => item._id === "offer")?.total || 0;
        const totalAmount = tithes + offers;

        // 🔥 CARDS
        const cards = [
            {
                title: "Membros",
                value: String(membersActive),
                description: "Membros ativos"
            },
            {
                title: "Eventos",
                value: String(totalEventsMonth),
                description: "Eventos este mês"
            },
            {
                title: "Financeiro",
                value: String(totalAmount),
                description: "Total arrecadado no mês"
            },
            {
                title: "Novos membros",
                value: String(newMembers),
                description: "Entraram este mês"
            }
        ];

    
        const now = new Date();
        const membersChartData = [];
        const eventsChartData = [];

        for (let i = 4; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

            const start = new Date(date.getFullYear(), date.getMonth(), 1);
            const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);

            const membersCount = await Member.countDocuments({
                createdAt: { $gte: start, $lt: end }
            });

            const eventsCount = await Event.countDocuments({
                date: { $gte: start, $lt: end }
            });

            const monthName = date.toLocaleString("pt-BR", { month: "short" });
            const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

            membersChartData.push({
                month: formattedMonth,
                membros: membersCount
            });

            eventsChartData.push({
                month: formattedMonth,
                eventos: eventsCount
            });
        }

       
        const pieChart = {
            title: "Dízimos vs Doações",
            subtitle: "Distribuição atual",
            data: [
                { name: "Dízimos", value: tithes },
                { name: "Doações", value: offers }
            ]
        };

        
        const weeklyData = [];

        for (let i = 3; i >= 0; i--) {
            const end = new Date();
            end.setDate(end.getDate() - (i * 7));

            const start = new Date(end);
            start.setDate(start.getDate() - 7);

            const result = await Contribution.aggregate([
                {
                    $match: {
                        date: { $gte: start, $lt: end }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ]);

            const total = result[0]?.total || 0;

            weeklyData.push({
                week: `Sem ${4 - i}`,
                valor: total
            });
        }

        const weeklyChart = {
            title: "Contribuições Semanais",
            subtitle: "Últimas 4 semanas",
            data: weeklyData
        };

       
        res.json({
            cards,
            chart: {
                period: "last_5_months",
                data: membersChartData
            },
            eventsChart: {
                period: "last_5_months",
                data: eventsChartData
            },
            pieChart,
            weeklyChart
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};