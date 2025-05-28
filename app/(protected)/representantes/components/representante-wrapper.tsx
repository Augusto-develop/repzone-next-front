"use client";
import { getCidadesByUF } from "@/action/cidade-actions";
import { getRepresentantes } from "@/action/representante-actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCustomSelectStyles } from "@/hooks/use-custom-input-styles";
import dayjs from "@/lib/dayjs";
import { CidadeOption, InputsFilterRepresentante, PayloadFilterRepresentante } from "@/lib/model/types";
import { estadoOptions } from "@/lib/options-select";
import 'dayjs/locale/pt-br';
import { Filter, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import Select from "react-select";
import { useRepresentanteContext } from "./representante-context";

const RepresentanteWrapper = ({ children }: { children: React.ReactNode }) => {

    const { setRepresentantes, setFilter, setIsLoading } = useRepresentanteContext();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const defaultValues: InputsFilterRepresentante = {
        nomeFilter: "",
        isSubmitFilter: false,
    }

    const {
        handleSubmit,
        register,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<InputsFilterRepresentante>({
        defaultValues
    });

    const onSubmit: SubmitHandler<InputsFilterRepresentante> = async (data) => {
        setIsSubmitting(true);
        setIsLoading(true);
        data.isSubmitFilter = true;

        const payload: PayloadFilterRepresentante = {
            nome: data.nomeFilter,
            isSubmit: data.isSubmitFilter,
        };

        const fetchedRepresentantes = await getRepresentantes(payload);

        setRepresentantes(fetchedRepresentantes);
        setFilter(payload);
        setIsSubmitting(false);
        setIsLoading(false);
    };

    return (
        <div>
            <h4 className="flex-none font-medium lg:text-2xl text-xl capitalize text-default-900">
                Consulta Representante
            </h4>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-wrap gap-4 mb-6 w-full">

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

export default RepresentanteWrapper;
