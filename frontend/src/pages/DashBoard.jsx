import { useEffect, useState } from "react";
import { api } from "@/services/api";

import { DashboardCard } from "@/components/DashboardCard";
import { PageHeader } from "@/components/PageHeader";
import { MembersChart } from "@/components/MembersChart";
import { EventsChart } from "@/components/EventsChart";
import { ContributionsChart } from "@/components/ContributionsChart";
import { ContributionsPieChart } from "@/components/ContributionsPieChart";

import { IoIosTrendingUp } from "react-icons/io";
import { IoMdPeople, IoMdCalendar } from "react-icons/io";
import { Loading } from "@/components/Loading";
import { formatCurrency } from "@/utils/formatCurrency";

export const DashBoard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/painel-dashboard");
        console.log("DADOS:", response.data); // 👈 AQUI
        setData(response.data);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      }
    };

    fetchDashboard();
  }, []);

  // 🔥 loading simples
  if (!data) {
    return <Loading />;
  }

  // 🎯 Mapear ícones dinamicamente
  const getIcon = (title) => {
    switch (title) {
      case "Membros":
      case "Novos membros":
        return <IoMdPeople size={40} />;
      case "Eventos":
        return <IoMdCalendar size={40} />;
      case "Financeiro":
        return <IoIosTrendingUp size={40} />;
      default:
        return <IoMdPeople size={40} />;
    }
  };

  const formatValue = (card) => {
  if (card?.title === "Financeiro") {
    return formatCurrency(Number(card?.value || 0));
  }

  return card?.value || 0;
};

  return (
    <div className="w-full max-w-6xl space-y-8">
      <PageHeader
        title="Visão Geral da Igreja"
        description="Bem-vindo ao painel administrativo. Aqui está o resumo da sua comunidade."
      />

      {/* CARDS DINÂMICOS */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
        {data.cards.map((card, index) => (
          <DashboardCard
            key={index}
            title={card?.title || 0}
            value={formatValue(card)}
            description={card?.description || 0}
            icon={getIcon(card?.title || 0)}
            trendIcon={<IoIosTrendingUp size={20} />}
          />
        ))}
      </div>

      {/* GRÁFICOS DINÂMICOS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MembersChart data={data.chart} />
        <EventsChart data={data.eventsChart} />
        <ContributionsPieChart data={data.pieChart} />
        <ContributionsChart data={data.weeklyChart} />
      </div>
    </div>
  );
};
