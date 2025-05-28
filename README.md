# Repzone Next Front

Interface web do projeto **Repzone**, desenvolvida com **Next.js**, **React**, **TypeScript** e **NextAuth**, com integração à API Laravel (Repzone Laravel API).

## 📦 Tecnologias Utilizadas

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [NextAuth.js](https://next-auth.js.org/)
- Docker
- Docker Compose

## ⚙️ Instalação Manual

```bash
# Clone o repositório
git clone https://github.com/Augusto-develop/repzone-next-front
cd repzone-next-front

# Instale as dependências
npm install

# Copie o .env de exemplo e configure
cp .env.example .env

Exemplo de .env

# URL pública da aplicação frontend (usada pelo navegador)
NEXT_PUBLIC_DOMINIO_API_URL=http://localhost:3500

# Autenticação NextAuth
NEXTAUTH_URL=http://localhost:3500
NEXTAUTH_SECRET=gerar

# API Laravel pública
NEXT_PUBLIC_REPZONE_LARAVEL_API_URL=http://localhost:8000/api/v1

# API Laravel dentro da rede do Docker Compose
NEXT_PUBLIC_REPZONE_LARAVEL_API_URL_DOCKER_NETWORK=http://prototype-upd8-laravel:8000/api/v1



🐳 Ambiente com Docker
Pré-requisitos

Certifique-se de que a rede externa personwallet-network já esteja criada no Docker:

docker network create personwallet-network

Estrutura do docker-compose.yml

version: '3.8'
services:
  prototype-upd8-next-front:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - PORT=3000
      - CHOKIDAR_USEPOLLING=true
    ports:
      - '3500:3000'
    volumes:
      - ./repzone-next-front:/var/www:cached
    extra_hosts:
      - 'host.docker.internal:host-gateway'
      - 'upd8:127.0.0.1'
    networks:
      - personwallet-network

networks:
  personwallet-network:
    external: true

    A aplicação estará disponível em: http://localhost:3500

Subir os serviços

docker-compose up --build

🔗 Integração com Laravel

A aplicação se comunica com a API Laravel hospedada no serviço prototype-upd8-laravel. Configure as URLs públicas e internas via .env:

    URL pública (acesso via navegador):
    http://localhost:8000/api/v1

    URL interna (dentro do Docker):
    http://prototype-upd8-laravel:8000/api/v1

🛠 Desenvolvimento com Dev Containers

    ⚠️ Para rodar corretamente com Dev Containers, inicie o servidor com:

npm run dev -- --hostname 0.0.0.0

📂 Estrutura

.
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── repzone-next-front/

📄 Licença

Este projeto está licenciado sob os termos da MIT License.


Vou salvar o arquivo para você baixar.  

[repzone-next-front-README.md](sandbox:/mnt/data/repzone-next-front-README.md)