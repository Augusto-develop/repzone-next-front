"use client";
import { getCidadesByUF } from "@/action/cidade-actions";
import { getRepresentantesByCidade } from "@/action/zona-actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCustomSelectStyles } from "@/hooks/use-custom-input-styles";
import { CidadeOption, InputsFilterZona, PayloadFilterZona } from "@/lib/model/types";
import { estadoOptions } from "@/lib/options-select";
import 'dayjs/locale/pt-br';
import { Filter, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import Select from "react-select";
import { useZonaContext } from "./zona-context";

const ZonaWrapper = ({ children }: { children: React.ReactNode }) => {

    const { setZonas, setFilter, setIsLoading } = useZonaContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dateInputRef = useRef<HTMLInputElement | null>(null);

    const { theme } = useTheme();
    const customStyles = useCustomSelectStyles(theme ?? "light");

    const defaultValues: InputsFilterZona = {
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
    } = useForm<InputsFilterZona>({
        defaultValues
    });

    const onSubmit: SubmitHandler<InputsFilterZona> = async (data) => {
        setIsSubmitting(true);
        setIsLoading(true);
        data.isSubmitFilter = true;

        const payload: PayloadFilterZona = {
            estado: data.estadoFilter?.value,
            cidade: data.cidadeFilter?.value,
            isSubmit: data.isSubmitFilter,
        };

        const fetchedZonas = await getRepresentantesByCidade(payload.cidade);

        setZonas(fetchedZonas);
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
                Consulta Zona de Atuação
            </h4>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-wrap gap-4 mb-6 w-full">

                    <div className="space-y-1 flex-1 min-w-[250px]">
                        <Label htmlFor="estadoFilter">Estado</Label>
                        <Controller
                            name="estadoFilter"
                            control={control}
                            rules={{ required: 'Selecione um estado' }}
                            render={({ field, fieldState }) => (
                                <>
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
                                    {fieldState.error && (
                                        <p className="text-sm text-red-500">{fieldState.error.message}</p>
                                    )}
                                </>
                            )}
                        />
                    </div>
                    <div className="space-y-1 flex-1 min-w-[250px]">
                        <Label htmlFor="cidadeFilter">Cidade</Label>
                        <Controller
                            name="cidadeFilter"
                            control={control}
                            rules={{ required: 'Selecione uma cidade' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <Select
                                        {...field}
                                        classNamePrefix="select"
                                        options={cidadeOptions}
                                        styles={customStyles}
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
                                    />
                                    {fieldState.error && (
                                        <p className="text-sm text-red-500">{fieldState.error.message}</p>
                                    )}
                                </>
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

export default ZonaWrapper;
