import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoPlus } from "react-icons/go";

export const ContribuicoesSettings = () => {
  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">
          Configurações de Contribuições
        </h2>
        <p className="text-sm text-gray-500">
          Configure como as contribuições serão registradas no sistema
        </p>
      </div>

      {/* 🔥 PIX */}
      <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-md">Chave PIX</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input placeholder="Tipo (CPF, Email, Telefone...)" />
          <Input placeholder="Chave PIX" />
        </div>

        <div className="flex justify-end">
          <Button className="bg-slate-800 hover:bg-slate-700">
            Salvar PIX
          </Button>
        </div>
      </div>

      {/* 🏷️ Tipos de contribuição */}
      <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-md">
          Tipos de Contribuição
        </h3>

        <div className="flex gap-2">
          <Input placeholder="Ex: Dízimo, Oferta, Campanha..." />
          <Button className="bg-slate-800 hover:bg-slate-700 flex items-center gap-2">
            <GoPlus />
            Adicionar
          </Button>
        </div>

        {/* lista mock */}
        <div className="flex gap-2 flex-wrap">
          <span className="bg-slate-100 px-3 py-1 rounded-full text-sm">
            Dízimo
          </span>
          <span className="bg-slate-100 px-3 py-1 rounded-full text-sm">
            Oferta
          </span>
        </div>
      </div>


      {/* ⚙️ Regras */}
      <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-md">
          Regras
        </h3>

        <div className="flex flex-col gap-3 text-sm">
          
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Permitir contribuições anônimas
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Exigir identificação do membro
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Gerar relatório automático mensal
          </label>

        </div>

        <div className="flex justify-end">
          <Button className="bg-slate-800 hover:bg-slate-700">
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
};