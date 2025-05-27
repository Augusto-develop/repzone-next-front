'use client';
import { Cidade, PayloadFilterCidade } from "@/lib/model/types";
import fetchWithAuth from "./login-actions";
import { CidadeDto } from "./types.schema.dto";

export const getCidades = async (
    payload?: PayloadFilterCidade
): Promise<Cidade[]> => {
    // Monta a URL com os parâmetros opcionais
    const queryParams = new URLSearchParams();

    if (payload) {
        if (payload.estado) queryParams.append("estado", payload.estado);
        if (payload.nome) queryParams.append("nome", payload.nome);
    }

    const url = `/cidades${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    // Faz a requisição
    const res = await fetchWithAuth(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let newData: Cidade[] = [];

    if (res.ok) {
        const data: CidadeDto[] = await res.json();
        newData = data.map((item) => convertDtoToCidade(item));
    } else {
        console.error('Erro ao buscar os dados');
    }
    return newData;
};


export const getCidadesByUF = async (uf: string): Promise<Cidade[]> => { 

    const url = `/cidades/estado/${uf}`;

    // Faz a requisição
    const res = await fetchWithAuth(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let newData: Cidade[] = [];

    if (res.ok) {
        const data: CidadeDto[] = await res.json();
        newData = data.map((item) => convertDtoToCidade(item));
    } else {
        console.error('Erro ao buscar os dados');
    }
    return newData;
};





export const createCidade = async (payload: CidadeDto): Promise<CidadeDto | undefined> => {

    delete payload.id;

    const res = await fetchWithAuth("/cidades", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newCidadeDto: CidadeDto = await res.json();
        return newCidadeDto;
    } else if (res.status === 422) {
        const errorData = await res.json();
        throw errorData.errors;
    }

    throw new Error(`Erro inesperado: ${res.status}`);
};

export const editCidade = async (payload: CidadeDto): Promise<CidadeDto | undefined> => {

    const res = await fetchWithAuth("/cidades/" + payload.id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newCidadeDto: CidadeDto = await res.json();
        return newCidadeDto;
    } else if (res.status === 422) {
        const errorData = await res.json();
        throw errorData.errors;
    }
};

export const deleteCidade = async (id: string): Promise<Response> => {
    const res = await fetchWithAuth(`/cidades/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return res;
};

export function convertDtoToCidade(cidadeDto: CidadeDto): Cidade {

    return {
        id: cidadeDto.id ?? '',
        estado: cidadeDto.estado,
        nome: cidadeDto.nome
    };
}