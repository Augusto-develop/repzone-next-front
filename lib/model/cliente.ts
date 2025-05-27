import type { Dayjs } from "dayjs";
import { Cidade, CidadeOption, EstadoOption, SexoOption } from "./types";

export type Cliente = {
  id: string;
  cpf: string;
  nome: string;
  datanasc: string;
  sexo: string;
  endereco: string;
  cidade: Cidade;
};

export type InputsFilterCliente = {
  cpfFilter?: string;
  nomeFilter?: string;
  datanascFilter?: Dayjs | null;
  sexoFilter?: SexoOption | null
  estadoFilter?: EstadoOption | null;
  cidadeFilter?: CidadeOption | null;
  isSubmitFilter: boolean;
}

export type PayloadFilterCliente = {
  cpf?: string;
  nome?: string;
  datanasc?: string;
  sexo?: string;
  estado?: string;
  cidade?: string;
  isSubmit: boolean;
}

export type InputsFormAddCliente = {
  id?: string;
  cpf?: string;
  nome?: string;
  datanasc?: Dayjs | null;
  sexo?: SexoOption | null;
  endereco?: string;
  estado?: EstadoOption | null;
  cidade?: CidadeOption | null;
}

