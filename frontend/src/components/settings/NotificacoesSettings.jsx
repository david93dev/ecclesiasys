import { Button } from "@/components/ui/button";

export const NotificacoesSettings = () => {
  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">
          Notificações
        </h2>
        <p className="text-sm text-gray-500">
          Configure como e quando o sistema deve enviar notificações
        </p>
      </div>

      {/* 🔔 Tipos de notificações */}
      <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="font-semibold">Eventos do Sistema</h3>

        <div className="flex flex-col gap-3 text-sm">

          <label className="flex items-center justify-between">
            Novo membro cadastrado
            <input type="checkbox" defaultChecked />
          </label>

          <label className="flex items-center justify-between">
            Nova contribuição registrada
            <input type="checkbox" defaultChecked />
          </label>

          <label className="flex items-center justify-between">
            Evento criado
            <input type="checkbox" />
          </label>

          <label className="flex items-center justify-between">
            Meta financeira atingida
            <input type="checkbox" />
          </label>

        </div>
      </div>

      {/* 📩 Canais */}
      <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="font-semibold">Canais de Notificação</h3>

        <div className="flex flex-col gap-3 text-sm">

          <label className="flex items-center justify-between">
            Notificações no sistema
            <input type="checkbox" defaultChecked />
          </label>

          <label className="flex items-center justify-between">
            Email
            <input type="checkbox" />
          </label>

          <label className="flex items-center justify-between">
            WhatsApp (futuro)
            <input type="checkbox" disabled />
          </label>

        </div>
      </div>

      {/* ⚙️ Configurações gerais */}
      <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="font-semibold">Configurações Gerais</h3>

        <div className="flex flex-col gap-3 text-sm">

          <label className="flex items-center justify-between">
            Receber resumo semanal
            <input type="checkbox" />
          </label>

          <label className="flex items-center justify-between">
            Receber relatório mensal
            <input type="checkbox" defaultChecked />
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