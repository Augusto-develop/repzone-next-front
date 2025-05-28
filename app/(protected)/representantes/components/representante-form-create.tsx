"use client";
// React
import { useEffect, useState } from "react";

// Next
import { useTheme } from "next-themes";

// Bibliotecas externas
import { SubmitHandler, useForm } from "react-hook-form";

// Actions
import {
  convertDtoToRepresentante,
  createRepresentante,
  editRepresentante as submitEditRepresentante
} from "@/action/representante-actions";
import { RepresentanteDto } from "@/action/types.schema.dto";

// Componentes UI
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Componentes locais
import { useRepresentanteContext } from "./representante-context";

// Tipos e constantes
import {
  InputsFormAddRepresentante,
  Representante
} from "@/lib/model/types";

import { Row } from "@tanstack/react-table";
import 'dayjs/locale/pt-br';
import { Loader2, Save } from "lucide-react";
import { toast as toastify } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormTaskProps {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  dataRepresentante?: Representante;
  row?: Row<Representante>;
}

const FormRepresentante = ({
  setOpen = undefined,
  dataRepresentante = undefined,
  row = undefined
}: FormTaskProps) => {

  const { editRepresentante } = useRepresentanteContext();

  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendErrors, setBackendErrors] = useState<{ [key: string]: string[] }>({});

  const submitCreate = async (data: InputsFormAddRepresentante): Promise<RepresentanteDto | undefined> => {
    const payload: RepresentanteDto = {
      id: data.id ?? "",
      nome: data.nome ?? "",
    };

    try {
      return payload.id?.trim() !== ""
        ? await submitEditRepresentante(payload)
        : await createRepresentante(payload);
    } catch (error) {
      // Lança o erro para o onSubmit tratar
      throw error;
    }
  };

  const defaultValues: InputsFormAddRepresentante = {
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
  } = useForm<InputsFormAddRepresentante>({ defaultValues });

  useEffect(() => {
    if (dataRepresentante) {
      reset({
        id: dataRepresentante.id,
        nome: dataRepresentante.nome,
      });
    }
  }, [dataRepresentante, reset]);

  const onSubmit: SubmitHandler<InputsFormAddRepresentante> = async (data) => {
    setIsSubmitting(true);
    setBackendErrors({});

    try {
      data.id = dataRepresentante?.id ?? undefined;

      const representanteDto: RepresentanteDto | undefined = await submitCreate(data);

      if (representanteDto) {

        if (!data.id) {
          toastify('Representante adicionado com sucesso!', {
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

        } else {
          if (typeof setOpen === 'function') {
            setOpen(false);
          }

          const rowEdit: Representante = convertDtoToRepresentante(representanteDto);
          editRepresentante(data.id, rowEdit);

          if (row) {
            setTimeout(() => {
              row.toggleSelected(false);
            }, 1500);
          }

          toastify('Representante alterado com sucesso!', {
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
          setError(field as keyof InputsFormAddRepresentante, {
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

  return (

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      <div className="space-y-1">
        <Label htmlFor="nome">Nome</Label>
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

export default FormRepresentante;
