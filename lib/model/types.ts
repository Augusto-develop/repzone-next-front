
import { Bandeira, Emissor } from "@/lib/model/enums";

export * from "./auth-response";
export * from "./cidade";
export * from "./cliente";
export * from "./representante";
export * from "./zona";

export interface Option {
    value: string;
    label: string;
    error?: string;
}

export type EstadoOption = {
    label: string;
    value: string;
    error?: string;
};

export type SexoOption = {
    label: string;
    value: string;
    error?: string;
};

export type CidadeOption = {
    label: string;
    value: string;
    error?: string;
};

export type RepresentanteOption = {
    label: string;
    value: string;
    error?: string;
};

export type IconAvatar = {
    text: string;
    avatar: string;
}

export type IconType =
    | Emissor.SANTANDER
    | Emissor.CAIXA
    | Emissor.NUBANK
    | Emissor.MERCADOPAGO
    | Emissor.ATACADAO
    | Emissor.NOVUCARD
    | Emissor.OUZE
    | Emissor.RIACHUELO
    | Emissor.BRASILCARD
    | Emissor.NEON
    | Bandeira.VISA
    | Bandeira.MASTERCARD
    | Emissor.BRADESCO
    | Emissor.ITAU
    | Emissor.BANCOBRASIL
    | Emissor.C6BANK
    | Emissor.MIDWAY
    | Emissor.BANCOPAN;