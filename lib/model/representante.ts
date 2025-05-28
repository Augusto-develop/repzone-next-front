export type Representante = {
  id: string;
  nome: string;  
};

export type InputsFilterRepresentante = {
  nomeFilter?: string;  
  isSubmitFilter: boolean;
}

export type PayloadFilterRepresentante = {
  nome?: string;  
  isSubmit: boolean;
}

export type InputsFormAddRepresentante = {
  id?: string;
  nome?: string; 
}

