import { DashboardCard } from "@/components/DashboardCard";
import { PageHeader } from "@/components/PageHeader";

import { IoIosTrendingUp } from "react-icons/io";
import {
  FaHandHoldingHeart,
  FaDonate,
  FaChurch,
  FaChartLine,
} from "react-icons/fa";
import { ContributionsChart } from "@/components/ContributionsChart";
import { ContributionsPieChart } from "@/components/ContributionsPieChart";
import { DataTable } from "@/components/DataTable";

export const Contributions = () => {
  const columns = [
    {
      key: "nome",
      label: "Nome",
      render: (row) => (
        <span className="font-medium text-gray-800">{row.nome}</span>
      ),
    },
    {
      key: "tipo",
      label: "Tipo",
      render: (row) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            row.tipo === "Dízimo"
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          } `}
        >
          {row.tipo}
        </span>
      ),
    },
    {
      key: "valor",
      label: "Valor",
      render: (row) => (
        <span className="font-medium">
          R$ {row.valor.toLocaleString("pt-BR")}
        </span>
      ),
    },
    {
      key: "data",
      label: "Data",
    },
  ];

  const data = [
    { nome: "João Silva", tipo: "Dízimo", valor: 500, data: "01/04/2026" },
    { nome: "Maria Souza", tipo: "Oferta", valor: 200, data: "02/04/2026" },
    { nome: "Carlos Lima", tipo: "Dízimo", valor: 750, data: "03/04/2026" },
    { nome: "Ana Paula", tipo: "Oferta", valor: 150, data: "04/04/2026" },
    { nome: "Pedro Santos", tipo: "Dízimo", valor: 1200, data: "05/04/2026" },
  ];
  const cards = [
    {
      title: "Total do Mês",
      value: "R$ 5.200",
      description: "Total arrecadado no mês",
      icon: <FaChartLine size={40} />,
    },
    {
      title: "Doações",
      value: "R$ 1.800",
      description: "Ofertas voluntárias",
      icon: <FaHandHoldingHeart size={40} />,
    },
    {
      title: "Dízimos",
      value: "R$ 2.700",
      description: "Contribuições de dízimo",
      icon: <FaChurch size={40} />,
    },
    {
      title: "Contribuições",
      value: "R$ 700",
      description: "Outras contribuições",
      icon: <FaDonate size={40} />,
    },
  ];

  return (
    <div className="w-full max-w-6xl space-y-8">
      <PageHeader
        title="Contribuições"
        description="Aqui está o resumo das doações e dízimos recebidos"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <DashboardCard
            key={index}
            {...card}
            trendIcon={<IoIosTrendingUp size={20} />}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ContributionsChart />
        <ContributionsPieChart />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Histórico de Contribuições</h2>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};
