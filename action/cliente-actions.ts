'use client';
import { Cliente, PayloadFilterCliente } from "@/lib/model/types";
import { convertToBrasilDate, formatCPF, removeSpecialCharacters } from "@/lib/utils";
import fetchWithAuth from "./login-actions";
import { ClienteDto } from "./types.schema.dto";

export const getClientes = async (
    payload?: PayloadFilterCliente
): Promise<Cliente[]> => {
    // Monta a URL com os parâmetros opcionais
    const queryParams = new URLSearchParams();

    if (payload) {
        if (payload.cpf) queryParams.append("cpf", removeSpecialCharacters(payload.cpf));
        if (payload.nome) queryParams.append("nome", payload.nome);
        if (payload.datanasc) queryParams.append("datanasc", payload.datanasc);
        if (payload.sexo) queryParams.append("sexo", payload.sexo);
        if (payload.estado) queryParams.append("estado", payload.estado);
        if (payload.cidade) queryParams.append("cidade", payload.cidade);
    }

    const url = `/clientes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    // Faz a requisição
    const res = await fetchWithAuth(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let newData: Cliente[] = [];

    if (res.ok) {
        const data: ClienteDto[] = await res.json();
        newData = data.map((item) => convertDtoToCliente(item));
    } else {
        console.error('Erro ao buscar os dados');
    }
    return newData;
};

export const createCliente = async (payload: ClienteDto): Promise<ClienteDto | undefined> => {

    delete payload.id;

    const res = await fetchWithAuth("/clientes", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newClienteDto: ClienteDto = await res.json();
        return newClienteDto;
    } else if (res.status === 422) {
        const errorData = await res.json();
        throw errorData.errors;
    }

    throw new Error(`Erro inesperado: ${res.status}`);
};

export const editCliente = async (payload: ClienteDto): Promise<ClienteDto | undefined> => {

    const res = await fetchWithAuth("/clientes/" + payload.id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newClienteDto: ClienteDto = await res.json();
        return newClienteDto;
    } else if (res.status === 422) {
        const errorData = await res.json();
        throw errorData.errors;
    }
};

export const deleteCliente = async (id: string): Promise<Response> => {
    const res = await fetchWithAuth(`/clientes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return res;
};

export function convertDtoToCliente(clienteDto: ClienteDto): Cliente {

    return {
        id: clienteDto.id ?? '',
        cpf: formatCPF(clienteDto.cpf),
        nome: clienteDto.nome,
        datanasc: convertToBrasilDate(clienteDto.datanasc),
        sexo: clienteDto.sexo,
        endereco: clienteDto.endereco,             
        cidade: {
            id: clienteDto.cidade?.id ?? '',
            estado: clienteDto.cidade?.estado ?? '',
            nome: clienteDto.cidade?.nome ?? ''
        }
    };
}