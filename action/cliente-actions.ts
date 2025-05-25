'use client';
import { dataClientes } from "@/app/(protected)/clientes/components/data-clientes";
import { Cliente, PayloadFilterCliente } from "@/lib/model/types";
import { convertToBrasilDate, formatCPF } from "@/lib/utils";
import fetchWithAuth from "./login-actions";
import { ClienteDto } from "./types.schema.dto";

export const getClientes = async (
    payload?: PayloadFilterCliente
): Promise<Cliente[]> => {
    // Monta a URL com os parâmetros opcionais
    const queryParams = new URLSearchParams();

    // if (creditId) {
    //     if (type && type === TypeCredit.DESPESAFIXA) {
    //         queryParams.append('type', type);
    //     } else {
    //         queryParams.append('creditId', creditId);
    //     }
    // }
    // if (mesfat) queryParams.append('mesfat', mesfat);
    // if (anofat) queryParams.append('anofat', anofat);

    // const url = `/despesa${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    // // Faz a requisição
    // const res = await fetchWithAuth(url, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // });


    let newData: Cliente[] = [];

    // if (res.ok) {
    if (true) {
        // const data: ClienteDto[] = await res.json();
        const data: ClienteDto[] = dataClientes;
        newData = data.map((item) => convertDtoToCliente(item));
    } else {
        console.error('Erro ao buscar os dados');
    }
    return newData;
};

export const createCliente = async (payload: ClienteDto): Promise<ClienteDto | undefined> => {

    delete payload.id;

    const res = await fetchWithAuth("/despesa", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newClienteDto: ClienteDto = await res.json();
        return newClienteDto;
    }

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
};

export const editCliente = async (payload: ClienteDto): Promise<ClienteDto | undefined> => {

    const res = await fetchWithAuth("/despesa/" + payload.id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newClienteDto: ClienteDto = await res.json();
        return newClienteDto;
    }

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
};

export const deleteCliente = async (id: string): Promise<Response> => {
    const res = await fetchWithAuth(`/despesa/${id}`, {
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
        estado: clienteDto.estado,
        cidade: clienteDto.cidade,
    };
}