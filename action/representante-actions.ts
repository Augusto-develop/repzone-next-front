'use client';
import { PayloadFilterRepresentante, Representante } from "@/lib/model/types";
import fetchWithAuth from "./login-actions";
import { RepresentanteDto } from "./types.schema.dto";

export const getRepresentantes = async (
    payload?: PayloadFilterRepresentante
): Promise<Representante[]> => {
    // Monta a URL com os parâmetros opcionais
    const queryParams = new URLSearchParams();

    if (payload) {
        if (payload.nome) queryParams.append("nome", payload.nome);
    }

    const url = `/representantes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    // Faz a requisição
    const res = await fetchWithAuth(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let newData: Representante[] = [];

    if (res.ok) {
        const data: RepresentanteDto[] = await res.json();
        newData = data.map((item) => convertDtoToRepresentante(item));
    } else {
        console.error('Erro ao buscar os dados');
    }
    return newData;
};

export const createRepresentante = async (payload: RepresentanteDto): Promise<RepresentanteDto | undefined> => {

    delete payload.id;

    const res = await fetchWithAuth("/representantes", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newRepresentanteDto: RepresentanteDto = await res.json();
        return newRepresentanteDto;
    } else if (res.status === 422) {
        const errorData = await res.json();
        throw errorData.errors;
    }

    throw new Error(`Erro inesperado: ${res.status}`);
};

export const editRepresentante = async (payload: RepresentanteDto): Promise<RepresentanteDto | undefined> => {

    const res = await fetchWithAuth("/representantes/" + payload.id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newRepresentanteDto: RepresentanteDto = await res.json();
        return newRepresentanteDto;
    } else if (res.status === 422) {
        const errorData = await res.json();
        throw errorData.errors;
    }
};

export const deleteRepresentante = async (id: string): Promise<Response> => {
    const res = await fetchWithAuth(`/representantes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return res;
};

export function convertDtoToRepresentante(representanteDto: RepresentanteDto): Representante {

    return {
        id: representanteDto.id ?? '',
        nome: representanteDto.nome        
    };
}