import { useEffect, useState } from "react";
import { api } from "@/services/api";

import { DashboardCard } from "@/components/DashboardCard";
import { PageHeader } from "@/components/PageHeader";

import { MembersChart } from "@/components/MembersChart";
import { EventsChart } from "@/components/EventsChart";
import { ContributionsChart } from "@/components/ContributionsChart";
import { ContributionsPieChart } from "@/components/ContributionsPieChart";

import { IoIosTrendingUp } from "react-icons/io";

import {
  IoMdPeople,
  IoMdCalendar,
} from "react-icons/io";

import { Loading } from "@/components/Loading";

import { formatCurrency } from "@/utils/formatCurrency";

export const DashBoard = () => {

  const [data, setData] = useState(null);

  // ✅ buscar dashboard
  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const response = await api.get("/painel-dashboard");

        setData(response.data);

      } catch (error) {

        console.error(
          "Erro ao carregar dashboard:",
          error
        );
      }
    };

    fetchDashboard();

  }, []);

  // ✅ loading
  if (!data) {

    return <Loading />;
  }

  // ✅ ícones dinâmicos
  const getIcon = (title) => {

    switch (title) {

      case "Membros":

      // eslint-disable-next-line no-fallthrough
      case "Novos membros":
        return <IoMdPeople size={34} />;

      case "Eventos":
        return <IoMdCalendar size={34} />;

      case "Financeiro":
        return <IoIosTrendingUp size={34} />;

      default:
        return <IoMdPeople size={34} />;
    }
  };

  // ✅ formatação valores
  const formatValue = (card) => {

    if (card?.title === "Financeiro") {

      return formatCurrency(
        Number(card?.value || 0)
      );
    }

    return card?.value || 0;
  };

  return (

    <div
      className="
        w-full space-y-6
        px-1
        sm:px-2
      "
    >

      {/* HEADER */}
      <PageHeader
        title="Visão Geral da Igreja"
        description="Bem-vindo ao painel administrativo. Aqui está o resumo da sua comunidade."
      />

      {/* CARDS */}
      <div
        className="
          grid gap-4

          grid-cols-1

          sm:grid-cols-2

          md:grid-cols-3
        "
      >

        {data.cards.map((card, index) => (

          <DashboardCard
            key={index}

            title={card?.title || 0}

            value={formatValue(card)}

            description={
              card?.description || 0
            }

            icon={getIcon(card?.title || 0)}

            trendIcon={
              <IoIosTrendingUp size={18} />
            }
          />
        ))}

      </div>

      {/* GRÁFICOS */}
      <div
        className="
          grid gap-6

          grid-cols-1

          2xl:grid-cols-2
        "
      >

        {/* MEMBROS */}
        <div
          className="
            min-w-0 overflow-hidden
            rounded-xl bg-white
            shadow-sm
          "
        >

          <MembersChart data={data.chart} />

        </div>

        {/* EVENTOS */}
        <div
          className="
            min-w-0 overflow-hidden
            rounded-xl bg-white
            shadow-sm
          "
        >

          <EventsChart
            data={data.eventsChart}
          />

        </div>

        {/* PIE */}
        <div
          className="
            min-w-0 overflow-hidden
            rounded-xl bg-white
            shadow-sm
          "
        >

          <ContributionsPieChart
            data={data.pieChart}
          />

        </div>

        {/* WEEKLY */}
        <div
          className="
            min-w-0 overflow-hidden
            rounded-xl bg-white
            shadow-sm
          "
        >

          <ContributionsChart
            data={data.weeklyChart}
          />

        </div>

      </div>

    </div>
  );
};