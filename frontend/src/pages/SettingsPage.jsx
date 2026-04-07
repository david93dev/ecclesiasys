import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { IgrejaSettings } from "@/components/settings/IgrejaSettings";
import { ContribuicoesSettings } from "@/components/settings/ContribuicoesSettings";
import { NotificacoesSettings } from "@/components/settings/NotificacoesSettings";
import { UsuariosSettings } from "@/components/settings/UsuariosSettings";

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("igreja");

  const tabs = [
    { id: "igreja", label: "Informações da Igreja" },
    { id: "usuarios", label: "Usuários do Sistema" },
    { id: "contribuicoes", label: "Contribuições" },
    { id: "notificacoes", label: "Notificações" },
  ];

  return (
    <div className="w-full max-w-6xl space-y-6">
      
      {/* Header */}
      <PageHeader
        title="Configurações"
        description="Gerencie as configurações do sistema"
      />

      {/* Menu superior */}
      <div className="flex gap-2 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition
              ${
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-gray-800"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="bg-white rounded-2xl p-6 shadow-md border">
        {activeTab === "igreja" && <IgrejaSettings />}
        {activeTab === "usuarios" && <UsuariosSettings />}
        {activeTab === "contribuicoes" && <ContribuicoesSettings />}
        {activeTab === "notificacoes" && <NotificacoesSettings />}
      </div>
    </div>
  );
};