import { EstadoOption } from "./types";

export type Cidade = {
  id: string;
  estado: string;
  nome: string; 
};

export type InputsFilterCidade = {  
  estadoFilter?: EstadoOption | null;
  nomeFilter?: string;
  isSubmitFilter: boolean;
}

export type PayloadFilterCidade = {  
  estado?: string;
  nome?: string;
  isSubmit: boolean;
}

export type InputsFormAddCidade = {
  id?: string;  
  estado?: EstadoOption | null;
  nome?: string;
}

