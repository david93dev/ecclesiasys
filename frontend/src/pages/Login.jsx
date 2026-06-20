import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/img/logo.png";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "E-mail ou senha inválidos");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-40 -top-40 size-96 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-32 size-[30rem] rounded-full bg-slate-500/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col">
        <Link
          to="/"
          className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Voltar para a página inicial
        </Link>

        <main className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-[1fr_0.85fr] lg:py-12">
          <section className="hidden max-w-xl lg:block">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo EcclesiaSys" className="size-12" />
              <span className="text-2xl font-bold text-white">
                Ecclesia<span className="text-amber-300">Sys</span>
              </span>
            </div>
            <p className="mt-12 text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
              Área administrativa
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
              Gestão eclesiástica simples, segura e organizada.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
              Acesse membros, ministérios, eventos e contribuições em uma única
              plataforma preparada para a rotina da sua igreja.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm text-slate-400">
              <span className="flex size-9 items-center justify-center rounded-full bg-amber-300/10 text-amber-300">
                <ShieldCheck className="size-5" />
              </span>
              Ambiente protegido para usuários autorizados
            </div>
          </section>

          <section className="mx-auto w-full max-w-md">
            <form
              onSubmit={handleLogin}
              className="rounded-2xl border border-white/10 bg-white p-6 shadow-2xl shadow-black/30 sm:p-8"
            >
              <div className="mb-8 lg:hidden">
                <div className="flex items-center gap-3">
                  <img src={logo} alt="Logo EcclesiaSys" className="size-11" />
                  <span className="text-2xl font-bold text-slate-950">
                    Ecclesia<span className="text-amber-500">Sys</span>
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-600">
                  Bem-vindo de volta
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  Acesse sua conta
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Informe suas credenciais para entrar no painel administrativo.
                </p>
              </div>

              <div className="mt-8 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">
                    E-mail
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="seuemail@exemplo.com"
                      className="h-12 border-slate-200 bg-slate-50 pl-10 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700">
                    Senha
                  </Label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Digite sua senha"
                      className="h-12 border-slate-200 bg-slate-50 pl-10 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="mt-7 h-12 w-full bg-slate-950 text-base font-semibold hover:bg-slate-800"
              >
                Entrar no sistema
              </Button>

              <p className="mt-6 text-center text-xs leading-5 text-slate-400">
                O acesso é exclusivo para usuários cadastrados pela igreja.
              </p>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
};
