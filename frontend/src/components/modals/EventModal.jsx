import { useEffect, useMemo, useState } from "react";

import { api } from "@/services/api";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

const initialForm = {

  title: "",

  description: "",

  date: "",

  responsibleId: "",

  participants: [],

  banner: null,

  bannerUrl: "",
};

export const EventModal = ({
  open,
  onClose,
  onSave,
  event,
}) => {

  const [members, setMembers] =
    useState([]);

  const [errors, setErrors] =
    useState({});

  const [form, setForm] =
    useState(initialForm);

  // ✅ carregar membros
  useEffect(() => {

    const fetchMembers = async () => {

      try {

        const res =
          await api.get("/member");

        setMembers(res.data);

      } catch {

        toast.error(
          "Erro ao carregar membros"
        );
      }
    };

    if (open) {

      fetchMembers();
    }

  }, [open]);

  // ✅ edição
  useEffect(() => {

    if (!open) return;

    if (event) {

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({

        title: event.title || "",

        description:
          event.description || "",

        date: event.date
          ? event.date.split("T")[0]
          : "",

        responsibleId:
          event.responsible?._id || "",

        participants:
          event.participants || [],

        banner: null,

        bannerUrl: event.bannerUrl || "",
      });

    } else {

      setForm(initialForm);
    }

    setErrors({});

  }, [event, open]);

  const bannerPreview = useMemo(() => {

    if (!form.banner) return form.bannerUrl || "";

    return URL.createObjectURL(form.banner);

  }, [form.banner, form.bannerUrl]);

  useEffect(() => {

    return () => {

      if (form.banner && bannerPreview) {
        URL.revokeObjectURL(bannerPreview);
      }
    };

  }, [form.banner, bannerPreview]);

  if (!open) return null;

  // ✅ handle change
  const handleChange = (field, value) => {

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  const handleBannerChange = (file) => {

    if (!file) return;

    handleChange("banner", file);
  };

  // ✅ validação
  const validate = () => {

    const newErrors = {};

    if (!form.title.trim()) {

      newErrors.title =
        "Título é obrigatório";
    }

    if (!form.description.trim()) {

      newErrors.description =
        "Descrição é obrigatória";
    }

    if (!form.date) {

      newErrors.date =
        "Data é obrigatória";
    }

    if (!form.responsibleId) {

      newErrors.responsibleId =
        "Selecione um responsável";
    }

    return newErrors;
  };

  // ✅ submit
  const handleSubmit = async (e) => {

    e.preventDefault();

    const validationErrors =
      validate();

    if (
      Object.keys(validationErrors)
        .length > 0
    ) {

      setErrors(validationErrors);

      toast.error(
        "Corrija os campos obrigatórios"
      );

      return;
    }

    setErrors({});

    try {

      await onSave(form);

      toast.success(
        "Evento salvo com sucesso!"
      );

      onClose();

    } catch (err) {

      console.error(
        "Erro ao salvar:",
        err
      );

      if (err.response?.data?.errors) {

        setErrors({
          general:
            err.response.data.errors,
        });

        toast.error(
          "Erro de validação"
        );

      } else if (
        err.response?.data?.message
      ) {

        setErrors({
          general:
            err.response.data.message,
        });

        toast.error(
          err.response.data.message
        );

      } else {

        setErrors({
          general:
            "Erro inesperado ao salvar",
        });

        toast.error(
          "Erro inesperado"
        );
      }
    }
  };

  return (

    <div
      className="
        fixed inset-0 z-50

        flex items-center justify-center

        bg-black/50

        px-3 py-6

        backdrop-blur-[2px]
      "
    >

      {/* MODAL */}
      <div
        className="
          relative

          max-h-[95vh]

          w-full max-w-2xl

          overflow-y-auto

          rounded-2xl

          bg-white

          p-5 shadow-2xl

          sm:p-6
        "
      >

        {/* HEADER */}
        <div
          className="
            mb-6 flex items-start
            justify-between gap-4
          "
        >

          <div>

            <h2
              className="
                text-xl font-bold
                text-slate-800

                sm:text-2xl
              "
            >

              {event
                ? "Editar Evento"
                : "Novo Evento"}

            </h2>

            <p
              className="
                mt-1 text-sm
                text-slate-500
              "
            >
              Gerencie informações do evento
            </p>

          </div>

          {/* fechar */}
          <button
            onClick={onClose}

            className="
              rounded-md p-2

              text-gray-500

              transition

              hover:bg-slate-100
              hover:text-gray-800
            "
          >
            ✕
          </button>

        </div>

        {/* ERRO */}
        {errors.general && (

          <div
            className="
              mb-4 rounded-xl

              bg-red-100

              p-3 text-sm
              text-red-700
            "
          >

            {errors.general}

          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* TÍTULO */}
          <div className="space-y-1.5">

            <Label>Título</Label>

            <Input
              type="text"

              placeholder="Título do evento"

              value={form.title}

              onChange={(e) =>
                handleChange(
                  "title",
                  e.target.value
                )
              }

              className="
                bg-slate-100
                p-5
              "
            />

            {errors.title && (

              <p className="text-sm text-red-500">

                {errors.title}

              </p>
            )}

          </div>

          {/* DESCRIÇÃO */}
          <div className="space-y-1.5">

            <Label>Descrição</Label>

            <textarea
              placeholder="Descreva o evento"

              value={form.description}

              onChange={(e) =>
                handleChange(
                  "description",
                  e.target.value
                )
              }

              className="
                min-h-[120px]
                w-full

                rounded-xl

                border border-slate-200

                bg-slate-100

                px-4 py-3

                text-sm

                outline-none

                transition

                focus:border-slate-400
                focus:ring-2
                focus:ring-slate-200
              "
            />

            {errors.description && (

              <p className="text-sm text-red-500">

                {errors.description}

              </p>
            )}

          </div>

          {/* BANNER */}
          <div className="space-y-1.5">

            <Label>Imagem do evento</Label>

            <div
              className="
                overflow-hidden rounded-xl
                border border-slate-200
                bg-slate-100
              "
            >
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  alt="Banner do evento"
                  className="
                    h-44 w-full
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    flex h-44 items-center
                    justify-center
                    text-sm text-slate-500
                  "
                >
                  Nenhuma imagem selecionada
                </div>
              )}
            </div>

            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleBannerChange(e.target.files?.[0])
              }
              className="
                bg-slate-100
                p-2
              "
            />

            <p className="text-xs text-slate-500">
              Formatos de imagem ate 5MB.
            </p>

          </div>

          {/* GRID */}
          <div
            className="
              grid gap-5

              md:grid-cols-2
            "
          >

            {/* DATA */}
            <div className="space-y-1.5">

              <Label>Data</Label>

              <Input
                type="date"

                value={form.date}

                onChange={(e) =>
                  handleChange(
                    "date",
                    e.target.value
                  )
                }

                className="
                  bg-slate-100
                  p-5
                "
              />

              {errors.date && (

                <p className="text-sm text-red-500">

                  {errors.date}

                </p>
              )}

            </div>

            {/* RESPONSÁVEL */}
            <div className="space-y-1.5">

              <Label>Responsável</Label>

              <select
                value={form.responsibleId}

                onChange={(e) =>
                  handleChange(
                    "responsibleId",
                    e.target.value
                  )
                }

                className="
                  w-full rounded-xl

                  border border-slate-200

                  bg-slate-100

                  px-4 py-3

                  text-sm

                  outline-none

                  transition

                  focus:border-slate-400
                  focus:ring-2
                  focus:ring-slate-200
                "
              >

                <option value="">
                  Selecione um responsável
                </option>

                {members.map((m) => (

                  <option
                    key={m._id}
                    value={m._id}
                  >

                    {m.name}

                  </option>
                ))}

              </select>

              {errors.responsibleId && (

                <p className="text-sm text-red-500">

                  {errors.responsibleId}

                </p>
              )}

            </div>

          </div>

          {/* FOOTER */}
          <div
            className="
              flex flex-col-reverse gap-3
              pt-4

              sm:flex-row
              sm:justify-end
            "
          >

            <Button
              type="button"

              variant="outline"

              onClick={onClose}

              className="
                w-full

                sm:w-auto
              "
            >
              Cancelar
            </Button>

            <Button
              type="submit"

              className="
                w-full

                bg-slate-900

                hover:bg-slate-700

                sm:w-auto
              "
            >
              Salvar
            </Button>

          </div>

        </form>
      </div>
    </div>
  );
};
