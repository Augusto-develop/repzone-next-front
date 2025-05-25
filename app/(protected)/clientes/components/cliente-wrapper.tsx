"use client";
import { getClientes } from "@/action/cliente-actions";
import { Button } from "@/components/ui/button";
import { CleaveInput } from "@/components/ui/cleave";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useCustomMuiDatepickerTheme, useCustomSelectStyles } from "@/hooks/use-custom-input-styles";
import dayjs from "@/lib/dayjs";
import { InputsFilterCliente, PayloadFilterCliente } from "@/lib/model/types";
import { estadoOptions, sexoOptions } from "@/lib/options-select";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { Dayjs } from "dayjs";
import { Filter, Loader2, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { toast as toastify } from 'react-toastify';
import { useClienteContext } from "./cliente-context";

const ClienteWrapper = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState<boolean>(false);
    const { clientes, setClientes, filter, setFilter } = useClienteContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast()
    const selectRef = useRef<any>(null);
    const dateInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs().local());

    const { theme } = useTheme();
    const customStyles = useCustomSelectStyles(theme ?? "light");
    const themeCustomMuiDatepicker = useCustomMuiDatepickerTheme(theme === "dark" ? "dark" : "light");


    const { handleSubmit, control, formState: { errors }, } = useForm<InputsFilterCliente>({
        defaultValues: {
            cpfFilter: "",
            nomeFilter: "",
            datanascFilter: undefined,
            sexoFilter: undefined,
            estadoFilter: undefined,
            cidadeFilter: undefined,
            isSubmitFilter: false,
        },
    });

    useEffect(() => {
        if (errors.datanascFilter && dateInputRef.current) {
            dateInputRef.current.focus();
        }
    }, [errors.datanascFilter]);

    const onSubmit: SubmitHandler<InputsFilterCliente> = async (data) => {
        setIsSubmitting(true);
        data.isSubmitFilter = true;

        if (data.datanascFilter) {
            if (!dayjs.isDayjs(data.datanascFilter) || !data.datanascFilter.isValid()) {                
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
                return;
            }
        }

        const payload: PayloadFilterCliente = {
            ...data,
            cpf: data.cpfFilter,
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
    };

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
                        <label
                            htmlFor="nomeFilter"
                            className="text-sm font-medium text-foreground"
                        >
                            Nome
                        </label>
                        <input
                            id="nomeFilter"
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
                                                if (value && (!value || !dayjs.isDayjs(value) || !value.isValid())) {
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
                        <label
                            htmlFor="sexoFilter"
                            className="text-sm font-medium text-foreground"
                        >
                            Sexo
                        </label>
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
                        <label
                            htmlFor="estadoFilter"
                            className="text-sm font-medium text-foreground"
                        >
                            Estado
                        </label>
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
                        <label
                            htmlFor="cidadeFilter"
                            className="text-sm font-medium text-foreground"
                        >
                            Cidade
                        </label>
                        <Controller
                            name="cidadeFilter"
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
                </div>


                <div className="flex flex-wrap gap-4 justify-between w-full">
                    {isSubmitting ? (
                        <Button size="md" color="primary" variant="soft" disabled>
                            <Loader2 className="me-2 h-4 w-4 animate-spin" />
                            Filtrar
                        </Button>
                    ) : (
                        <Button size="md" color="primary" variant="soft" type="submit">
                            <Filter className="w-4 h-4 me-2" />
                            Filtrar
                        </Button>
                    )}
                    <Button type="button" size="md" color="success" variant="soft" className="flex-none" onClick={() => setOpen(true)} >
                        <Plus className="w-4 h-4 me-2" />
                        <span>Adicionar</span>
                    </Button>
                </div>
            </form>

            {children}
        </div>
    );
};

export default ClienteWrapper;
