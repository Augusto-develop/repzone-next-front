'use client';
import { PayloadFilterZona, Representante, Zona } from "@/lib/model/types";
import fetchWithAuth from "./login-actions";
import { RepresentanteDto, ZonaDto } from "./types.schema.dto";
import { convertDtoToRepresentante } from "./representante-actions";

export const getRepresentantesByCidade = async (
    cidade_id?: string
): Promise<Zona[]> => {    
    const url = `/zonas/cidade/${cidade_id}`;

    // Faz a requisição
    const res = await fetchWithAuth(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let newData: Zona[] = [];

    if (res.ok) {
        const data: ZonaDto[] = await res.json();
        newData = data.map((item) => convertDtoToZona(item));
    } else {
        console.error('Erro ao buscar os dados');
    }
    return newData;
};

export const getRepresentantesByCliente = async (
    cliente_id?: string
): Promise<Representante[]> => {
    const url = `/zonas/cliente/${cliente_id}`;

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

export const createZona = async (payload: ZonaDto): Promise<ZonaDto | undefined> => {

    const res = await fetchWithAuth("/zonas", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newZonaDto: ZonaDto = await res.json();
        return newZonaDto;
    } else if (res.status === 422) {
        const errorData = await res.json();
        throw errorData.errors;
    }

    throw new Error(`Erro inesperado: ${res.status}`);
};

export const deleteZona = async (zona_id: string): Promise<Response> => {

    const [representanteId, cidadeId] = zona_id.split(':');

    const res = await fetchWithAuth(`/zonas/${cidadeId}/${representanteId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return res;
};

export function convertDtoToZona(zonaDto: ZonaDto): Zona {

    return {
        cidade: {
            id: zonaDto.cidade?.id ?? "",
            estado: zonaDto.cidade?.estado ?? "",
            nome: zonaDto.cidade?.nome ?? "",
        },
        representante: {
            id: zonaDto.representante?.id ?? "",
            nome: zonaDto.representante?.nome ?? "",
        }
    };
}