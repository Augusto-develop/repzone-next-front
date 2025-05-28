import { Cidade, Representante, CidadeOption, EstadoOption, RepresentanteOption } from "./types";

export type Zona = {  
  cidade: Cidade;
  representante: Representante;
};

export type InputsFilterZona = { 
  estadoFilter?: EstadoOption | null;
  cidadeFilter?: CidadeOption | null;
  isSubmitFilter: boolean;
}

export type PayloadFilterZona = {  
  estado?: string;
  cidade?: string;
  isSubmit: boolean;
}

export type InputsFormAddZona = {  
  estado?: EstadoOption | null;
  cidade?: CidadeOption | null;
  representante?: RepresentanteOption | null;
}

