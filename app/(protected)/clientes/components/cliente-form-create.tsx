"use client";
// React
import { useEffect, useRef, useState } from "react";

// Next
import { useTheme } from "next-themes";

// Bibliotecas externas
import dayjs, { Dayjs } from "@/lib/dayjs";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import Select from "react-select";

// MUI
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

// Actions
import {
  convertDtoToCliente,
  createCliente,
  editCliente as submitEditCliente
} from "@/action/cliente-actions";
import { ClienteDto } from "@/action/types.schema.dto";

// Componentes UI
import { Button } from "@/components/ui/button";
import { CleaveInput } from "@/components/ui/cleave";
import { Label } from "@/components/ui/label";

// Componentes locais
import { useClienteContext } from "./cliente-context";

// Hooks
import {
  useCustomMuiDatepickerTheme,
  useCustomSelectStyles
} from "@/hooks/use-custom-input-styles";

// Tipos e constantes
import {
  CidadeOption,
  Cliente,
  InputsFormAddCliente
} from "@/lib/model/types";
import { estadoOptions, sexoOptions } from "@/lib/options-select";
import { removeSpecialCharacters } from "@/lib/utils";

import { getCidadesByUF } from "@/action/cidade-actions";
import { Row } from "@tanstack/react-table";
import 'dayjs/locale/pt-br';
import { Loader2, Save } from "lucide-react";
import { toast as toastify } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormTaskProps {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  dataCliente?: Cliente;
  row?: Row<Cliente>;
}

const FormCliente = ({
  setOpen = undefined,
  dataCliente = undefined,
  row = undefined
}: FormTaskProps) => {

  dayjs.locale('pt-br');

  const { clientes, setClientes, editCliente, filter } = useClienteContext();

  const { theme } = useTheme();
  const customStyles = useCustomSelectStyles(theme ?? "light");
  const themeCustomMuiDatepicker = useCustomMuiDatepickerTheme(theme === "dark" ? "dark" : "light");
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs().local());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendErrors, setBackendErrors] = useState<{ [key: string]: string[] }>({});

  const submitCreate = async (data: InputsFormAddCliente): Promise<ClienteDto | undefined> => {
    const payload: ClienteDto = {
      id: data.id ?? "",
      cpf: removeSpecialCharacters(data.cpf ?? ""),
      nome: data.nome ?? "",
      datanasc: data.datanasc && dayjs.isDayjs(data.datanasc) && data.datanasc.isValid()
        ? data.datanasc.format("YYYY-MM-DD")
        : "",
      sexo: data.sexo?.value ?? "",
      endereco: data.endereco ?? "",
      cidade_id: data.cidade?.value ?? "",
    };

    try {
      return payload.id?.trim() !== ""
        ? await submitEditCliente(payload)
        : await createCliente(payload);
    } catch (error) {
      // Lança o erro para o onSubmit tratar
      throw error;
    }
  };

  const defaultValues: InputsFormAddCliente = {
    cpf: "",
    nome: "",
    datanasc: null,
    sexo: null,
    endereco: "",
    estado: null,
    cidade: null
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
  } = useForm<InputsFormAddCliente>({ defaultValues });


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
    if (dataCliente) {
      reset({
        id: dataCliente.id,
        cpf: dataCliente.cpf,
        nome: dataCliente.nome,
        datanasc: dayjs(dataCliente.datanasc, 'DD/MM/YYYY'),
        sexo: { label: dataCliente.sexo, value: dataCliente.sexo },
        endereco: dataCliente.endereco,
        estado: { label: dataCliente.cidade.estado, value: dataCliente.cidade.estado },
        cidade: { label: dataCliente.cidade.nome, value: dataCliente.cidade.nome },
      });
    }
  }, [dataCliente, reset]);

  const onSubmit: SubmitHandler<InputsFormAddCliente> = async (data) => {
    setIsSubmitting(true);
    setBackendErrors({});

    try {
      data.id = dataCliente?.id ?? undefined;

      const clienteDto: ClienteDto | undefined = await submitCreate(data);

      console.log(clienteDto);

      if (clienteDto) {

        if (!data.id) {
          toastify('Cliente adicionado com sucesso!', {
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

          const rowEdit: Cliente = convertDtoToCliente(clienteDto);
          editCliente(data.id, rowEdit);

          if (row) {
            setTimeout(() => {
              row.toggleSelected(false);
            }, 1500);
          }

          toastify('Cliente alterado com sucesso!', {
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
          setError(field as keyof InputsFormAddCliente, {
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
        <Label htmlFor="cpf">CPF</Label>
        <Controller
          name="cpf"
          control={control}
          defaultValue={""}
          rules={{
            required: 'CPF é obrigatório',
            pattern: {
              value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
              message: 'CPF inválido',
            },
          }}
          render={({ field }) => (
            <>
              <CleaveInput
                {...field}
                options={{
                  blocks: [3, 3, 3, 2],
                  delimiters: ['.', '.', '-'],
                  numericOnly: true,
                }}
                placeholder="000.000.000-00"
                id="cpf"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.cpf
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
                  }`}
              />
              {errors.cpf && (
                <p className="text-red-500 text-sm">{errors.cpf.message}</p>
              )}
            </>
          )}
        />
      </div>
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
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
        <div className="space-y-1">
          <Label htmlFor="datanasc">Data de Nascimento</Label>

          <ThemeProvider theme={themeCustomMuiDatepicker}>
            <CssBaseline />
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="pt-br"
            >
              <DemoContainer components={["DatePicker"]} sx={{ padding: 0 }}>
                <Controller
                  name="datanasc"
                  control={control}
                  rules={{
                    required: "Data de nascimento é obrigatória",
                    validate: (value) =>
                      !value || !dayjs(value, "DD/MM/YYYY", true).isValid()
                        ? "Data inválida"
                        : true
                  }}
                  render={({ field }) => (
                    <>
                      <DesktopDatePicker
                        {...field}
                        format="DD/MM/YYYY"
                        onChange={(newValue) => {
                          setSelectedDate(newValue);
                          field.onChange(newValue);
                        }}
                        slotProps={{
                          textField: {
                            id: "datanasc",
                            fullWidth: true,
                            error: !!errors.datanasc,
                            helperText: "",
                            inputRef: dateInputRef,
                            sx: {
                              height: 50
                            },
                          },
                          popper: {
                            container: modalRef.current ?? undefined,
                            className: "custom-date-picker",
                          },
                        }}
                      />
                    </>
                  )}
                />
              </DemoContainer>
            </LocalizationProvider>
          </ThemeProvider>
          {errors.datanasc && (
            <p className="text-red-500 text-sm mt-1">
              {errors.datanasc.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="sexo">Sexo</Label>
          <Controller
            name="sexo"
            control={control}
            rules={{ required: "Sexo é obrigatório" }}
            render={({ field }) => (
              <>
                <Select
                  {...field}
                  classNamePrefix="select"
                  options={sexoOptions}
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
                      borderColor: errors.sexo ? '#ef4444' : base.borderColor, // vermelho-500 se erro
                      boxShadow: state.isFocused
                        ? errors.sexo
                          ? '0 0 0 1px #ef4444'
                          : '0 0 0 1px #3b82f6' // azul-500 se focado
                        : base.boxShadow,
                      '&:hover': {
                        borderColor: errors.sexo ? '#ef4444' : '#3b82f6', // hover vermelho ou cinza
                      },
                    }),
                  }}
                />
                {errors.sexo && (
                  <p className="text-red-500 text-sm">{errors.sexo.message}</p>
                )}
              </>
            )}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="endereco">Endereço</Label>
        <input
          id="endereco"
          {...register("endereco", { required: "Endereço é obrigatório" })}
          size={30}
          placeholder=""
          maxLength={150}
          className={`h-10 w-full rounded-md px-3 py-2 text-sm 
                  placeholder:text-muted-foreground 
                  focus:outline-none transition duration-300 
                  disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-secondary read-only:bg-secondary
                  ${errors.endereco
              ? 'border border-red-500 focus:border-red-500 bg-white'
              : 'border border-gray-300 focus:border-primary bg-white'}
              `}
        />
        {errors.endereco && (
          <p className="text-red-500 text-sm">{errors.endereco.message}</p>
        )}
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

export default FormCliente;
