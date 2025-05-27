export interface AuthResponseDto {
    token: string;
    expiresIn: number;
    id: string;
    name: string;
}

export type ClienteDto = {
    id?: string;
    cpf: string;
    nome: string;
    datanasc: string;
    sexo: string;
    endereco: string;    
    cidade_id: string;
    cidade?: CidadeDto;   
};

export type CidadeDto = {
    id?: string;
    estado: string;
    nome: string;
};