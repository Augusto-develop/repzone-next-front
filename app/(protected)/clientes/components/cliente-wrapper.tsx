"use client";
import { getCidadesByUF } from "@/action/cidade-actions";
import { getClientes } from "@/action/cliente-actions";
import { Button } from "@/components/ui/button";
import { CleaveInput } from "@/components/ui/cleave";
import { Label } from "@/components/ui/label";
import { useCustomMuiDatepickerTheme, useCustomSelectStyles } from "@/hooks/use-custom-input-styles";
import dayjs from "@/lib/dayjs";
import { CidadeOption, InputsFilterCliente, PayloadFilterCliente } from "@/lib/model/types";
import { estadoOptions, sexoOptions } from "@/lib/options-select";
import { removeSpecialCharacters } from "@/lib/utils";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { Dayjs } from "dayjs";
import 'dayjs/locale/pt-br';
import { Filter, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import Select from "react-select";
import { toast as toastify } from 'react-toastify';
import { useClienteContext } from "./cliente-context";


const ClienteWrapper = ({ children }: { children: React.ReactNode }) => {

    dayjs.locale('pt-br');

    const { setClientes, setFilter, setIsLoading } = useClienteContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dateInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs().local());

    const { theme } = useTheme();
    const customStyles = useCustomSelectStyles(theme ?? "light");
    const themeCustomMuiDatepicker = useCustomMuiDatepickerTheme(theme === "dark" ? "dark" : "light");

    const defaultValues: InputsFilterCliente = {
        cpfFilter: "",
        nomeFilter: "",
        datanascFilter: null,
        sexoFilter: null,
        estadoFilter: null,
        cidadeFilter: null,
        isSubmitFilter: false,
    }

    const {
        handleSubmit,
        register,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<InputsFilterCliente>({
        defaultValues
    });

    useEffect(() => {
        if (errors.datanascFilter && dateInputRef.current) {
            dateInputRef.current.focus();
        }
    }, [errors.datanascFilter]);

    const onSubmit: SubmitHandler<InputsFilterCliente> = async (data) => {
        setIsSubmitting(true);
        setIsLoading(true);
        data.isSubmitFilter = true;

        if (data.datanascFilter) {
            if (data.datanascFilter && !dayjs(data.datanascFilter, "DD/MM/YYYY", true).isValid()) {

                toastify('Data de nascimento inválida!', {
                    type: 'error',
                    autoClose: 3000,
                    hideProgressBar: true,
                    position: 'bottom-center',
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored"
                });
                setIsSubmitting(false);
                setIsLoading(false);
                return;
            }
        }

        const payload: PayloadFilterCliente = {
            cpf: removeSpecialCharacters(data.cpfFilter ?? ""),
            nome: data.nomeFilter,
            datanasc: data.datanascFilter ? data.datanascFilter.format("YYYY-MM-DD") : "",
            sexo: data.sexoFilter?.value,
            estado: data.estadoFilter?.value,
            cidade: data.cidadeFilter?.value,
            isSubmit: data.isSubmitFilter,
        };

        const fetchedClientes = await getClientes(payload);

        setClientes(fetchedClientes);
        setFilter(payload);
        setIsSubmitting(false);
        setIsLoading(false);
    };


    //loading cidades por estado
    const estadoSelecionado = useWatch({ control, name: "estadoFilter" });
    const [cidadeOptions, setCidadeOptions] = useState<CidadeOption[]>([]);
    const [loadingCidades, setLoadingCidades] = useState(false);

    useEffect(() => {
        async function fetchCidades() {
            if (estadoSelecionado?.value) {
                setLoadingCidades(true);  // Inicia loading

                try {
                    setValue("cidadeFilter", null);

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
                    setValue("cidadeFilter", null);
                } finally {
                    setLoadingCidades(false); // Finaliza loading
                }
            } else {
                setCidadeOptions([]);
                setValue("cidadeFilter", null);
            }
        }

        fetchCidades();
    }, [estadoSelecionado, setValue]);

    return (
        <div>
            <h4 className="flex-none font-medium lg:text-2xl text-xl capitalize text-default-900">
                Consulta Cliente
            </h4>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-wrap gap-4 mb-6 w-full">
                    <div className="space-y-1 flex-1 min-w-[250px]">
                        <Label htmlFor="cpfFilter">CPF</Label>
                        <Controller
                            name="cpfFilter"
                            control={control}
                            defaultValue={""}
                            render={({ field }) => (
                                <CleaveInput
                                    {...field}
                                    options={{
                                        blocks: [3, 3, 3, 2],
                                        delimiters: ['.', '.', '-'],
                                        numericOnly: true,
                                    }}
                                    placeholder="000.000.000-00"
                                    id="cpfFilter"
                                />
                            )}
                        />
                    </div>
                    <div className="space-y-1 flex-1 min-w-[250px]">
                        <Label htmlFor="nomeFilter">Nome</Label>
                        <input
                            id="nomeFilter"
                            {...register("nomeFilter")}
                            size={30}
                            placeholder=""
                            maxLength={150}
                            className="h-10 w-full rounded border border-default-300 bg-background px-3 py-2 
                                        text-sm text-foreground placeholder:text-muted-foreground focus:outline-none 
                                        focus:border-primary transition duration-300 disabled:cursor-not-allowed 
                                        disabled:opacity-50 disabled:bg-secondary read-only:bg-secondary"
                        />
                    </div>

                    <div className="space-y-1 flex-1 min-w-[250px]">
                        <Label htmlFor="datanascFilter">Data Nascimento</Label>

                        <ThemeProvider theme={themeCustomMuiDatepicker}>
                            <CssBaseline />
                            <LocalizationProvider
                                dateAdapter={AdapterDayjs}
                                adapterLocale="pt-br"
                            >
                                <DemoContainer components={["DatePicker"]} sx={{ padding: 0 }}>
                                    <Controller
                                        name="datanascFilter"
                                        control={control}
                                        rules={{
                                            validate: (value) => {
                                                if (value && !dayjs(value, "DD/MM/YYYY", true).isValid()) {
                                                    toastify('Data de nascimento inválida!', {
                                                        type: 'error',
                                                        autoClose: 3000,
                                                        hideProgressBar: true,
                                                        position: 'bottom-center',
                                                        closeOnClick: true,
                                                        pauseOnHover: true,
                                                        draggable: true,
                                                        theme: "colored"
                                                    });
                                                    return "Data inválida";
                                                }
                                                return true;
                                            },
                                        }}
                                        render={({ field }) => (
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
                                                        variant: "outlined",
                                                        size: "small",
                                                        error: !!errors.datanascFilter,
                                                        helperText: errors.datanascFilter?.message || "",
                                                        inputRef: dateInputRef,
                                                        sx: {
                                                            height: 40,
                                                            fontSize: 14,
                                                            fontWeight: null,
                                                        },
                                                    },
                                                    popper: {
                                                        className: "custom-date-picker",
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </ThemeProvider>
                    </div>

                    <div className="space-y-1 flex-1 min-w-[250px]">
                        <Label htmlFor="sexoFilter">Sexo</Label>
                        <Controller
                            name="sexoFilter"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    classNamePrefix="select"
                                    options={sexoOptions}
                                    styles={customStyles}
                                    isClearable
                                    onChange={(selected) => {
                                        field.onChange(selected ?? undefined);
                                    }}
                                    formatOptionLabel={(option) => (
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium">{option.label}</span>
                                        </div>
                                    )}
                                />
                            )}
                        />
                    </div>
                    <div className="space-y-1 flex-1 min-w-[250px]">
                        <Label htmlFor="estadoFilter">Estado</Label>
                        <Controller
                            name="estadoFilter"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    classNamePrefix="select"
                                    options={estadoOptions}
                                    styles={customStyles}
                                    isClearable
                                    onChange={(selected) => {
                                        field.onChange(selected ?? undefined);
                                    }}
                                    formatOptionLabel={(option) => (
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium">{option.label}</span>
                                        </div>
                                    )}
                                />
                            )}
                        />
                    </div>
                    <div className="space-y-1 flex-1 min-w-[250px]">
                        <Label htmlFor="cidadeFilter">Cidade</Label>
                        <Controller
                            name="cidadeFilter"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    classNamePrefix="select"
                                    options={cidadeOptions}
                                    styles={customStyles}
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
                                />
                            )}
                        />
                    </div>
                </div>


                <div className="flex flex-wrap gap-4 justify-end w-full">
                    {isSubmitting ? (
                        <Button size="md" color="primary" disabled>
                            <Loader2 className="me-2 h-4 w-4 animate-spin" />
                            Filtrar
                        </Button>
                    ) : (
                        <Button size="md" color="primary" type="submit">
                            <Filter className="w-4 h-4 me-2" />
                            Pesquisar
                        </Button>
                    )}
                    <Button size="md" color="info" variant="soft" type="button" onClick={() => reset(defaultValues)}>
                        <Filter className="w-4 h-4 me-2" />
                        Limpar
                    </Button>
                </div>
            </form>

            {children}
        </div>
    );
};

export default ClienteWrapper;
