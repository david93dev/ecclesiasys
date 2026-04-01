import { DashboardCard } from "@/components/DashboardCard";
import { PageHeader } from "@/components/PageHeader";
import { MembersChart } from "@/components/MembersChart";
import { EventsChart } from "@/components/EventsChart";

import { IoIosTrendingUp } from "react-icons/io";
import { IoMdPeople, IoMdCalendar } from "react-icons/io";

export const DashBoard = () => {
  const cards = [
    {
      title: "Membros",
      value: "42",
      description: "Membros ativos",
      icon: <IoMdPeople size={40} />,
    },
    {
      title: "Eventos",
      value: "8",
      description: "Eventos este mês",
      icon: <IoMdCalendar size={40} />,
    },
    {
      title: "Visitantes",
      value: "15",
      description: "Últimos cultos",
      icon: <IoMdPeople size={40} />,
    },
    {
      title: "Células",
      value: "6",
      description: "Ativas",
      icon: <IoMdCalendar size={40} />,
    },
  ];

  return (
    <div className="w-full max-w-6xl space-y-8">

      <PageHeader
        title="Visão Geral da Igreja"
        description="Bem-vindo ao painel administrativo. Aqui está o resumo da sua comunidade."
      />

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <DashboardCard
            key={index}
            {...card}
            trendIcon={<IoIosTrendingUp size={20} />}
          />
        ))}
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MembersChart />
        <EventsChart />
      </div>

    </div>
  );
};