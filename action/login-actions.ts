import { AuthResponse } from "@/lib/model/auth-response";
import { getSession } from "next-auth/react";
import { AuthResponseDto } from "./types.schema.dto";

const url_dominio = process.env.NEXT_PUBLIC_REPZONE_LARAVEL_API_URL;
const url_dominio_network_docker = process.env.NEXT_PUBLIC_REPZONE_LARAVEL_API_URL_DOCKER_NETWORK;

export const handleLogin = async (email: string, password: string): Promise<AuthResponse> => {

  const res = await fetch(`${url_dominio_network_docker}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  if (!res.ok) {

    const errorResponse = await res.json();
    console.error("Erro da API:", errorResponse);
    throw new Error(errorResponse.message || 'Erro desconhecido durante o login');
  }

  const response: AuthResponseDto = await res.json();

  return convertDtoToAuthResponse(response);
};

export const handleRefreshToken = async (): Promise<AuthResponse> => {
  const res = await fetch(`${url_dominio_network_docker}/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || 'Erro desconhecido ao atualizar o token');
  }

  const response: AuthResponseDto = await res.json();
  return convertDtoToAuthResponse(response);
};

export default async function fetchWithAuth(
  url_recurso: string,
  options: RequestInit = {}
): Promise<Response> {
  const session = await getSession();

  if (!session) {
    if (typeof window !== "undefined") window.location.replace("/");
    throw new Error("Sessão não encontrada. Redirecionando para a página inicial.");
  }

  let pwApiToken = session.user?.pwApiToken;

  if (pwApiToken) {
    options.headers = {
      ...options.headers,
      Accept: "application/json",
      Authorization: `Bearer ${pwApiToken}`,
    };
  }

  try {
    let response = await fetch(`${url_dominio}${url_recurso}`, {
      credentials: 'include', // <- Necessário para enviar cookies (CSRF/session)
      ...options,
    });

    const clone = response.clone();
    const data = await clone.json().catch(() => null);
    const tokenPossivelmenteExpirado = [401, 403, 419, 498].includes(response.status) ||
      data?.message?.toLowerCase().includes("token");

    if (tokenPossivelmenteExpirado && response.status !== 405) {
      try {
        const newAuth = await handleRefreshToken();

        pwApiToken = newAuth.token;

        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${pwApiToken}`,
        };

        response = await fetch(`${url_dominio}${url_recurso}`, {
          credentials: 'include', // <- Também aqui
          ...options,
        });
      } catch {
        // if (typeof window !== "undefined") window.location.replace("/");
        // throw new Error("Token expirado e não foi possível renovar. Redirecionando...");
      }
    }

    return response;
  } catch (error) {
    console.error("Erro ao fazer a requisição:", error);
    throw error;
  }
}





export function convertDtoToAuthResponse(authResponseDto: AuthResponseDto): AuthResponse {
  return {
    id: authResponseDto.id,
    name: authResponseDto.name,
    token: authResponseDto.token,
    expiresIn: authResponseDto.expiresIn,
  };
}