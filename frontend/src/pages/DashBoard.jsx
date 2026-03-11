import { DashboardCard } from "@/components/DashboardCard";
import { IoIosTrendingUp } from "react-icons/io";
import { IoMdPeople } from "react-icons/io";
import { IoMdCalendar } from "react-icons/io";

export const DashBoard = () => {
  return (
    <div className="w-full space-y-8">
      <div className="">
        <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
          Visão Geral da Igreja
        </h2>
        <p className="">
          Bem-vindo ao painel administrativo. Aqui está o resumo da sua
          comunidade.
        </p>
      </div>

      <div className="flex flex-wrap gap-6">
        <DashboardCard
          title="Membros"
          value="42"
          description="Membros ativos"
          icon={<IoMdPeople size={40} />}
          trendIcon={<IoIosTrendingUp size={20} />}
        />

        <DashboardCard
          title="Eventos"
          value="8"
          description="Eventos este mês"
          icon={<IoMdCalendar size={40} />}
          trendIcon={<IoIosTrendingUp size={20} />}
        />

            <DashboardCard
          title="Membros"
          value="42"
          description="Membros ativos"
          icon={<IoMdPeople size={40} />}
          trendIcon={<IoIosTrendingUp size={20} />}
        />

        <DashboardCard
          title="Eventos"
          value="8"
          description="Eventos este mês"
          icon={<IoMdCalendar size={40} />}
          trendIcon={<IoIosTrendingUp size={20} />}
        />
     
     
      </div>
    </div>
  );
};
