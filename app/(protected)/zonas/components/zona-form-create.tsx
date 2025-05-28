"use client";
// React
import { useEffect, useState } from "react";

// Next
import { useTheme } from "next-themes";

// Bibliotecas externas
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import Select from "react-select";

// Actions
import { ZonaDto } from "@/action/types.schema.dto";
import {
  createZona
} from "@/action/zona-actions";

// Componentes UI
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Componentes locais

// Tipos e constantes
import {
  CidadeOption,
  InputsFormAddZona,
  RepresentanteOption,
  Zona
} from "@/lib/model/types";
import { estadoOptions } from "@/lib/options-select";

import { getCidadesByUF } from "@/action/cidade-actions";
import { getRepresentantes } from "@/action/representante-actions";
import { Row } from "@tanstack/react-table";
import 'dayjs/locale/pt-br';
import { Loader2, Save } from "lucide-react";
import { toast as toastify } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormTaskProps {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  dataZona?: Zona;
  row?: Row<Zona>;
}

const FormZona = ({
  setOpen = undefined,
  dataZona = undefined,
  row = undefined
}: FormTaskProps) => {

  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendErrors, setBackendErrors] = useState<{ [key: string]: string[] }>({});
  const [representanteOptions, setRepresentanteOptions] = useState<RepresentanteOption[]>([]);
  const [loadingRepresentantes, setLoadingRepresentantes] = useState(false);

  const submitCreate = async (data: InputsFormAddZona): Promise<ZonaDto | undefined> => {
    const payload: ZonaDto = {
      representante_id: data.representante?.value ?? "",
      cidade_id: data.cidade?.value ?? "",
    };

    try {
      return await createZona(payload);
    } catch (error) {
      // Lança o erro para o onSubmit tratar
      throw error;
    }
  };

  const defaultValues: InputsFormAddZona = {
    estado: null,
    cidade: null,
    representante: null,
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<InputsFormAddZona>({ defaultValues });

  //loading cidades por estado
  const estadoSelecionado = useWatch({ control, name: "estado" });
  const [cidadeOptions, setCidadeOptions] = useState<CidadeOption[]>([]);
  const [loadingCidades, setLoadingCidades] = useState(false);

  useEffect(() => {
    async function fetchCidades() {
      if (estadoSelecionado?.value) {
        setLoadingCidades(true);  // Inicia loading

        try {
          setValue("cidade", null);

          const listCidades = await getCidadesByUF(estadoSelecionado.value);

          if (listCidades && listCidades.length > 0) {
            const listOptionsCidades: CidadeOption[] = listCidades.map(cidade => ({
              label: cidade.nome,
              value: cidade.id,
            }));
            setCidadeOptions(listOptionsCidades);
          } else {
            setCidadeOptions([]);
          }
        } catch (error) {
          setCidadeOptions([]);
          setValue("cidade", null);
        } finally {
          setLoadingCidades(false); // Finaliza loading
        }
      } else {
        setCidadeOptions([]);
        setValue("cidade", null);
      }
    }

    fetchCidades();
  }, [estadoSelecionado, setValue]);


  useEffect(() => {
    async function fetchRepresentantes() {
      setLoadingRepresentantes(true); // Inicia loading
      try {
        const listaRepresentantes = await getRepresentantes();
        const optionsRepresentante: RepresentanteOption[] = listaRepresentantes.map(rep => ({
          value: rep.id,
          label: rep.nome
        }));
        setRepresentanteOptions(optionsRepresentante);
      } catch (error) {
        console.error("Erro ao buscar representantes:", error);
        setRepresentanteOptions([]);
      } finally {
        setLoadingRepresentantes(false); // Finaliza loading
      }
    }

    fetchRepresentantes();
  }, []);

  const onSubmit: SubmitHandler<InputsFormAddZona> = async (data) => {
    setIsSubmitting(true);
    setBackendErrors({});

    try {
      const zonaDto: ZonaDto | undefined = await submitCreate(data);

      if (zonaDto) {

        toastify('Zona de atuação adicionada com sucesso!', {
          type: 'success',
          autoClose: 3000,
          hideProgressBar: true,
          position: 'bottom-center',
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored"
        });
        reset(defaultValues);
      }
    } catch (error: any) {
      // Espera um objeto com erros no formato { campo: [msg1, msg2] }
      if (typeof error === "object" && error !== null) {
        setBackendErrors(error);

        Object.entries(error).forEach(([field, messages]) => {
          if (field === "cidade_id" || field === "representante_id") {
            setError("representante", {
              type: "server",
              message: (messages as string[]).join(", "),
            });
          } else {           
            setError(field as keyof InputsFormAddZona, {
              type: "server",
              message: (messages as string[]).join(", "),
            });
          }
        });
      } else {
        toastify(`Erro inesperado: ${error}`, { type: 'error' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      <div className="space-y-1">
        <Label htmlFor="representante">Representante</Label>
        <Controller
          name="representante"
          control={control}
          rules={{ required: "Representante é obrigatório" }}
          render={({ field }) => (
            <>
              <Select
                {...field}
                classNamePrefix="select"
                options={representanteOptions}
                isClearable
                isLoading={loadingRepresentantes}
                isDisabled={loadingRepresentantes}
                placeholder={loadingRepresentantes ? "Carregando representantes..." : "Select"}
                onChange={(selected) => {
                  field.onChange(selected ?? undefined);
                }}
                formatOptionLabel={(option) => (
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                )}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderColor: errors.representante ? '#ef4444' : base.borderColor, // vermelho-500 se erro
                    boxShadow: state.isFocused
                      ? errors.representante
                        ? '0 0 0 1px #ef4444'
                        : '0 0 0 1px #3b82f6' // azul-500 se focado
                      : base.boxShadow,
                    '&:hover': {
                      borderColor: errors.representante ? '#ef4444' : '#3b82f6', // hover vermelho ou cinza
                    },
                  }),
                }}
              />
              {errors.representante && (
                <p className="text-red-500 text-sm">{errors.representante.message}</p>
              )}
            </>
          )}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="estado">Estado</Label>
        <Controller
          name="estado"
          control={control}
          rules={{ required: "Estado é obrigatório" }}
          render={({ field }) => (
            <>
              <Select
                {...field}
                classNamePrefix="select"
                options={estadoOptions}
                isClearable
                onChange={(selected) => {
                  field.onChange(selected ?? undefined);
                }}
                formatOptionLabel={(option) => (
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                )}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderColor: errors.estado ? '#ef4444' : base.borderColor, // vermelho-500 se erro
                    boxShadow: state.isFocused
                      ? errors.estado
                        ? '0 0 0 1px #ef4444'
                        : '0 0 0 1px #3b82f6' // azul-500 se focado
                      : base.boxShadow,
                    '&:hover': {
                      borderColor: errors.estado ? '#ef4444' : '#3b82f6', // hover vermelho ou cinza
                    },
                  }),
                }}
              />
              {errors.estado && (
                <p className="text-red-500 text-sm">{errors.estado.message}</p>
              )}
            </>
          )}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="cidade">Cidade</Label>
        <Controller
          name="cidade"
          control={control}
          rules={{ required: "Cidade é obrigatória" }}
          render={({ field }) => (
            <>
              <Select
                {...field}
                classNamePrefix="select"
                options={cidadeOptions}
                isClearable
                isLoading={loadingCidades}
                isDisabled={loadingCidades || !estadoSelecionado}
                placeholder={loadingCidades ? "Carregando..." : "Select"}
                onChange={(selected) => {
                  field.onChange(selected ?? undefined);
                }}
                formatOptionLabel={(option) => (
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                )}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderColor: errors.cidade ? '#ef4444' : base.borderColor, // vermelho-500 se erro
                    boxShadow: state.isFocused
                      ? errors.cidade
                        ? '0 0 0 1px #ef4444'
                        : '0 0 0 1px #3b82f6' // azul-500 se focado
                      : base.boxShadow,
                    '&:hover': {
                      borderColor: errors.cidade ? '#ef4444' : '#3b82f6', // hover vermelho ou cinza
                    },
                  }),
                }}
              />
              {errors.cidade && (
                <p className="text-red-500 text-sm mt-1">{errors.cidade.message}</p>
              )}
            </>
          )}
        />
      </div>
      <div className="flex justify-end">
        {isSubmitting ? (
          <Button size="md" color="success" disabled>
            <Loader2 className="me-2 h-4 w-4 animate-spin" />
            Salvar
          </Button>
        ) : (
          <Button size="md" color="success" type="submit">
            <Save className="w-4 h-4 me-2" />
            Salvar
          </Button>
        )}
      </div>
    </form>

  );
};

export default FormZona;
