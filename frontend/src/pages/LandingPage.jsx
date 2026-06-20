import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChartNoAxesCombined,
  Church,
  Clock3,
  HandCoins,
  LayoutDashboard,
  Mail,
  Menu,
  MessageCircle,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import logo from "@/assets/img/logo.png";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";

const churchImages = [
  {
    src: "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1400&q=85",
    alt: "Comunidade reunida durante uma celebração na igreja",
    label: "Comunhão que transforma",
  },
  {
    src: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1400&q=85",
    alt: "Interior de uma igreja iluminada",
    label: "Um lugar para pertencer",
  },
  {
    src: "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1400&q=85",
    alt: "Momento de louvor em comunidade",
    label: "Fé vivida em comunidade",
  },
];

const features = [
  {
    icon: ChartNoAxesCombined,
    title: "Gestao clara",
    description:
      "Acompanhe membros, ministerios e dados essenciais da igreja em uma rotina simples.",
  },
  {
    icon: CalendarDays,
    title: "Eventos organizados",
    description:
      "Centralize programacoes, datas importantes e atividades para manter todos alinhados.",
  },
  {
    icon: HandCoins,
    title: "Contribuicoes",
    description:
      "Visualize entradas, historicos e indicadores para apoiar uma administracao responsavel.",
  },
];

const managementModules = [
  {
    icon: Users,
    title: "Gestão de membros",
    description:
      "Cadastre membros, mantenha contatos atualizados e consulte informações importantes em poucos cliques.",
  },
  {
    icon: Church,
    title: "Ministérios",
    description:
      "Organize ministérios, responsáveis e participantes para acompanhar melhor cada área da igreja.",
  },
  {
    icon: CalendarDays,
    title: "Agenda de eventos",
    description:
      "Planeje programações, defina responsáveis e acompanhe os participantes de cada evento.",
  },
  {
    icon: HandCoins,
    title: "Contribuições",
    description:
      "Registre contribuições e visualize históricos para apoiar uma administração financeira responsável.",
  },
  {
    icon: LayoutDashboard,
    title: "Painel de indicadores",
    description:
      "Acompanhe números de membros, eventos e contribuições em gráficos claros e centralizados.",
  },
  {
    icon: ShieldCheck,
    title: "Acesso protegido",
    description:
      "Mantenha os dados administrativos restritos aos usuários autenticados da sua equipe.",
  },
];

const formatEventDate = (date) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

const currentMonthName = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
}).format(new Date());

export const LandingPage = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [events, setEvents] = useState([]);
  const [eventsStatus, setEventsStatus] = useState("loading");

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentImage((current) => (current + 1) % churchImages.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPublicEvents = async () => {
      try {
        const response = await api.get("/event/public");
        setEvents(response.data);
        setEventsStatus("success");
      } catch {
        setEventsStatus("error");
      }
    };

    fetchPublicEvents();
  }, []);

  const showPreviousImage = () => {
    setCurrentImage(
      (current) => (current - 1 + churchImages.length) % churchImages.length,
    );
  };

  const showNextImage = () => {
    setCurrentImage((current) => (current + 1) % churchImages.length);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="EcclesiaSys">
            <img src={logo} alt="Logo EcclesiaSys" className="size-10" />
            <span className="text-xl font-bold tracking-normal">
              Ecclesia<span className="text-amber-500">Sys</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a className="transition hover:text-slate-950" href="#recursos">
              Recursos
            </a>
            <a className="transition hover:text-slate-950" href="#gestao">
              Gestao
            </a>
            <a className="transition hover:text-slate-950" href="#eventos">
              Eventos
            </a>
            <a className="transition hover:text-slate-950" href="#contato">
              Contato
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              size="icon-lg"
              variant="outline"
              className="rounded-full"
              title="Area de membros"
              aria-label="Area de membros"
            >
              <Link to="/login">
                <User className="size-5" />
              </Link>
            </Button>

            <Button
              size="icon-lg"
              variant="ghost"
              className="md:hidden"
              aria-label="Menu"
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </nav>
      </header>

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <div className="max-w-2xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">
                Sistema de gestao eclesiastica
              </p>
              <h1 className="text-4xl font-bold leading-tight tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
                EcclesiaSys
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Uma plataforma para organizar membros, ministerios, eventos e
                contribuicoes com mais agilidade no dia a dia da igreja.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-11 bg-slate-950 px-5 text-base hover:bg-slate-800"
                >
                  <Link to="/login">Acessar area de membros</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-11 px-5 text-base">
                  <a href="#recursos">Conhecer recursos</a>
                </Button>
              </div>
            </div>

            <div
              className="relative min-h-[420px] overflow-hidden rounded-2xl bg-slate-950 shadow-2xl"
              aria-roledescription="carrossel"
              aria-label="Imagens da igreja"
            >
              {churchImages.map((image, index) => (
                <img
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${
                    index === currentImage ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden={index !== currentImage}
                />
              ))}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                <div>
                  <span className="mb-3 block h-1 w-10 rounded-full bg-amber-400" />
                  <p className="max-w-xs text-xl font-semibold text-white sm:text-2xl">
                    {churchImages[currentImage].label}
                  </p>
                  <div className="mt-4 flex gap-2" aria-label="Selecionar imagem">
                    {churchImages.map((image, index) => (
                      <button
                        key={image.src}
                        type="button"
                        onClick={() => setCurrentImage(index)}
                        className={`h-1.5 rounded-full transition-all ${
                          index === currentImage
                            ? "w-8 bg-amber-400"
                            : "w-4 bg-white/50 hover:bg-white"
                        }`}
                        aria-label={`Mostrar imagem ${index + 1}`}
                        aria-current={index === currentImage ? "true" : undefined}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    onClick={showPreviousImage}
                    className="rounded-full bg-white/90"
                    aria-label="Imagem anterior"
                  >
                    <ArrowLeft className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    onClick={showNextImage}
                    className="rounded-full bg-white/90"
                    aria-label="Próxima imagem"
                  >
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="recursos" className="bg-slate-50 py-16">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 max-w-2xl">
              <h2 className="text-3xl font-bold tracking-normal text-slate-950">
                Recursos para uma administracao mais leve
              </h2>
              <p className="mt-3 text-slate-600">
                O sistema conecta as principais areas da igreja em um painel
                preparado para acesso interno.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {features.map((feature) => {
                const FeatureIcon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="mb-5 flex size-10 items-center justify-center rounded-md bg-amber-100 text-amber-700">
                      <FeatureIcon className="size-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-950">
                      {feature.title}
                    </h3>
                    <p className="mt-2 leading-7 text-slate-600">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="gestao" className="border-y border-slate-200 bg-white py-16 sm:py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">
                  Gestão integrada
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
                  Tudo o que sua equipe precisa em um só lugar
                </h2>
              </div>
              <p className="max-w-2xl leading-7 text-slate-600 lg:justify-self-end">
                O EcclesiaSys conecta as principais rotinas administrativas da
                igreja, reduz tarefas manuais e transforma informações dispersas
                em uma visão organizada para apoiar decisões mais seguras.
              </p>
            </div>

            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-2 lg:grid-cols-3">
              {managementModules.map((module) => {
                const ModuleIcon = module.icon;

                return (
                  <article
                    key={module.title}
                    className="group bg-white p-6 transition hover:bg-slate-50 sm:p-7"
                  >
                    <div className="flex size-11 items-center justify-center rounded-lg bg-slate-950 text-amber-300 transition group-hover:bg-amber-400 group-hover:text-slate-950">
                      <ModuleIcon className="size-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-slate-950">
                      {module.title}
                    </h3>
                    <p className="mt-2 leading-7 text-slate-600">
                      {module.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="eventos" className="bg-slate-950 py-16 text-white sm:py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
                  Próximos eventos
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
                  Programação de {currentMonthName}
                </h2>
                <p className="mt-4 leading-7 text-slate-300">
                  Confira os encontros e atividades do mês cadastrados pela igreja.
                  Quando não houver programação no período, mostramos os demais
                  eventos cadastrados.
                </p>
              </div>
              <span className="flex w-fit items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-slate-300">
                <CalendarDays className="size-4 text-amber-300" />
                Agenda atualizada
              </span>
            </div>

            {eventsStatus === "loading" && (
              <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="Carregando eventos">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-64 animate-pulse rounded-xl bg-white/10" />
                ))}
              </div>
            )}

            {eventsStatus === "error" && (
              <div className="mt-10 rounded-xl border border-white/10 bg-white/5 px-6 py-10 text-center text-slate-300">
                Não foi possível carregar os eventos agora. Tente novamente mais tarde.
              </div>
            )}

            {eventsStatus === "success" && events.length === 0 && (
              <div className="mt-10 rounded-xl border border-white/10 bg-white/5 px-6 py-10 text-center text-slate-300">
                Nenhum evento cadastrado no momento.
              </div>
            )}

            {eventsStatus === "success" && events.length > 0 && (
              <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <article
                    key={event._id}
                    className="flex min-h-64 flex-col rounded-xl border border-white/10 bg-white/[0.06] p-6 transition hover:-translate-y-1 hover:border-amber-300/40 hover:bg-white/[0.09]"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-amber-300">
                      <CalendarDays className="size-4" />
                      <time dateTime={event.date}>{formatEventDate(event.date)}</time>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-white">
                      {event.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 leading-7 text-slate-300">
                      {event.description}
                    </p>
                    <div className="mt-auto pt-6 text-sm font-medium text-slate-400">
                      Evento da comunidade
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="contato" className="bg-slate-50 py-16 sm:py-20">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">
                Contato
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
                Estamos prontos para ajudar sua igreja
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                Converse com nossa equipe para tirar dúvidas, conhecer melhor o
                EcclesiaSys ou receber suporte sobre a plataforma.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-7 h-11 bg-slate-950 px-5 hover:bg-slate-800"
              >
                <a href="mailto:contato@ecclesiasys.com.br">
                  <MessageCircle className="size-4" />
                  Falar com nossa equipe
                </a>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex size-11 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <Mail className="size-5" />
                </div>
                <h3 className="mt-5 font-semibold text-slate-950">E-mail</h3>
                <a
                  href="mailto:contato@ecclesiasys.com.br"
                  className="mt-2 block text-sm text-slate-600 transition hover:text-amber-700"
                >
                  contato@ecclesiasys.com.br
                </a>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex size-11 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <Clock3 className="size-5" />
                </div>
                <h3 className="mt-5 font-semibold text-slate-950">Atendimento</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Segunda a sexta-feira, das 8h às 18h.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 py-8 text-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo EcclesiaSys" className="size-9" />
            <span className="font-semibold">
              Ecclesia<span className="text-amber-300">Sys</span>
            </span>
          </div>
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} EcclesiaSys. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};
