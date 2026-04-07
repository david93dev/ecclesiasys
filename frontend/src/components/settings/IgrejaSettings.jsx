import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const IgrejaSettings = () => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">
          Informações da Igreja
        </h2>
        <p className="text-sm text-gray-500">
          Atualize os dados principais da igreja
        </p>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        
        {/* Nome */}
        <div className="space-y-1">
          <label className="text-sm font-medium">
            Nome da Igreja
          </label>
          <Input placeholder="Ex: Igreja Batista Central" />
        </div>

        {/* Telefone */}
        <div className="space-y-1">
          <label className="text-sm font-medium">
            Telefone
          </label>
          <Input placeholder="(83) 99999-9999" />
        </div>

        {/* Endereço (full width) */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium">
            Endereço
          </label>
          <Input placeholder="Rua, número, bairro..." />
        </div>

        {/* Cidade */}
        <div className="space-y-1">
          <label className="text-sm font-medium">
            Cidade
          </label>
          <Input placeholder="Campina Grande" />
        </div>

        {/* Estado */}
        <div className="space-y-1">
          <label className="text-sm font-medium">
            Estado
          </label>
          <Input placeholder="PB" />
        </div>
      </div>

      {/* Botão */}
      <div className="flex justify-end">
        <Button
          className="bg-slate-800 p-5 hover:bg-slate-700 flex items-center gap-2"
        >
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
};