import type { Dayjs } from "dayjs";
import { CidadeOption, EstadoOption, SexoOption } from "./types";

export type Cliente = {
  id: string;
  cpf: string;
  nome: string;
  datanasc: string;
  sexo: string;
  endereco: string;
  estado: string;
  cidade: string;
};

export type InputsFilterCliente = {
  cpfFilter?: string;
  nomeFilter?: string;
  datanascFilter?: Dayjs;
  sexoFilter?: SexoOption
  estadoFilter?: EstadoOption;
  cidadeFilter?: CidadeOption;
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
  cpf: string;
  nome: string;
  datanasc: Dayjs;
  sexo: SexoOption | undefined;
  endereco: string;
  estado: EstadoOption | undefined;
  cidade: CidadeOption | undefined;
}

