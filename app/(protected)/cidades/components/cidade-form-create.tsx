"use client";
// React
import { useEffect, useRef, useState } from "react";

// Next
import { useTheme } from "next-themes";

// Bibliotecas externas
import dayjs, { Dayjs } from "@/lib/dayjs";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";

// MUI

// Actions
import {
  convertDtoToCidade,
  createCidade,
  editCidade as submitEditCidade
} from "@/action/cidade-actions";
import { CidadeDto } from "@/action/types.schema.dto";

// Componentes UI
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Componentes locais
import { useCidadeContext } from "./cidade-context";

// Hooks
import {
  useCustomMuiDatepickerTheme,
  useCustomSelectStyles
} from "@/hooks/use-custom-input-styles";

// Tipos e constantes
import {
  Cidade,
  InputsFormAddCidade
} from "@/lib/model/types";
import { estadoOptions } from "@/lib/options-select";

import { Row } from "@tanstack/react-table";
import 'dayjs/locale/pt-br';
import { Loader2, Save } from "lucide-react";
import { toast as toastify } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormTaskProps {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  dataCidade?: Cidade;
  row?: Row<Cidade>;
}

const FormCidade = ({
  setOpen = undefined,
  dataCidade = undefined,
  row = undefined
}: FormTaskProps) => {

  dayjs.locale('pt-br');

  const { cidades, setCidades, editCidade, filter } = useCidadeContext();

  const { theme } = useTheme();
  const customStyles = useCustomSelectStyles(theme ?? "light");
  const themeCustomMuiDatepicker = useCustomMuiDatepickerTheme(theme === "dark" ? "dark" : "light");
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs().local());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendErrors, setBackendErrors] = useState<{ [key: string]: string[] }>({});

  const submitCreate = async (data: InputsFormAddCidade): Promise<CidadeDto | undefined> => {
    const payload: CidadeDto = {
      id: data.id ?? "",
      estado: data.estado?.value ?? "",
      nome: data.nome ?? "",
    };

    try {
      return payload.id?.trim() !== ""
        ? await submitEditCidade(payload)
        : await createCidade(payload);
    } catch (error) {
      // Lança o erro para o onSubmit tratar
      throw error;
    }
  };

  const defaultValues: InputsFormAddCidade = {
    estado: undefined,
    nome: ""
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
  } = useForm<InputsFormAddCidade>({ defaultValues });

  useEffect(() => {
    if (dataCidade) {
      reset({
        id: dataCidade.id,        
        estado: { label: dataCidade.estado, value: dataCidade.estado },
        nome: dataCidade.nome,
      });
    }
  }, [dataCidade, reset]);

  const onSubmit: SubmitHandler<InputsFormAddCidade> = async (data) => {
    setIsSubmitting(true);
    setBackendErrors({});

    try {
      data.id = dataCidade?.id ?? undefined;

      const cidadeDto: CidadeDto | undefined = await submitCreate(data);

      if (cidadeDto) {

        if (!data.id) {
          toastify('Cidade adicionada com sucesso!', {
            type: 'success',
            autoClose: 3000,
            hideProgressBar: true,
            position: 'bottom-center',
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored"
          });
          reset();

        } else {
          if (typeof setOpen === 'function') {
            setOpen(false);
          }

          const rowEdit: Cidade = convertDtoToCidade(cidadeDto);
          editCidade(data.id, rowEdit);

          if (row) {
            setTimeout(() => {
              row.toggleSelected(false);
            }, 1500);
          }

          toastify('Cidade alterado com sucesso!', {
            type: 'success',
            autoClose: 3000,
            hideProgressBar: true,
            position: 'bottom-center',
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored"
          });
        }
      }
    } catch (error: any) {
      // Espera um objeto com erros no formato { campo: [msg1, msg2] }
      if (typeof error === "object" && error !== null) {
        setBackendErrors(error);

        // Marca cada erro no React Hook Form
        Object.entries(error).forEach(([field, messages]) => {
          setError(field as keyof InputsFormAddCidade, {
            type: "server",
            message: (messages as string[]).join(", "),
          });
        });
      } else {
        toastify(`Erro inesperado: ${error}`, { type: 'error' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalRef = useRef<HTMLDivElement>(null);

  return (

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        <Label htmlFor="nome">Nome da Cidade</Label>
        <input
          id="nome"
          {...register("nome", { required: "Nome é obrigatório" })}
          size={30}
          placeholder=""
          maxLength={150}
          className={`h-10 w-full rounded-md px-3 py-2 text-sm 
                  placeholder:text-muted-foreground 
                  focus:outline-none transition duration-300 
                  disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-secondary read-only:bg-secondary
                  ${errors.nome
              ? 'border border-red-500 focus:border-red-500 bg-white'
              : 'border border-gray-300 focus:border-primary bg-white'}
              `}
        />
        {errors.nome && (
          <p className="text-red-500 text-sm">{errors.nome.message}</p>
        )}
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

export default FormCidade;
