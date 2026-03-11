import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import logo from "@/assets/img/logo.png";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // // validação simples
    // if (!email || !password) return;

    navigate("/dashboard");
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-linear-to-tr from-slate-900 to-slate-600 p-4">
      
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-xl"
      >
        {/* Logo */}
        <div className="flex items-end justify-center gap-3 border-b pb-4">
          <img src={logo} alt="logo" className="h-10 w-10" />

          <h1 className="text-3xl font-bold text-gray-900">
            Ecclesia<span className="text-amber-400">Sys</span>
          </h1>
        </div>

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
          <p className="text-sm text-center text-gray-500">Acesse sua conta</p>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label className="font-semibold text-gray-700">Email</Label>
          <Input
            type="email"
            placeholder="Digite seu email"
            className="bg-slate-100 p-5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Senha */}
        <div className="space-y-2">
          <Label className="font-semibold text-gray-700">Senha</Label>
          <Input
            type="password"
            placeholder="Digite sua senha"
            className="bg-slate-100 p-5"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Botão */}
        <Button
          type="submit"
          className="w-full bg-linear-to-r from-slate-900 to-slate-700 py-5 text-lg hover:from-slate-800 hover:to-slate-600"
        >
          Entrar
        </Button>

      </form>
    </div>
  );
};