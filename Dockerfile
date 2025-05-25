# Use a imagem base oficial do Node.js
FROM node:20-alpine

# Instale pacotes necessários
RUN apk update && apk add --no-cache \
    curl \
    unzip \
    bash \
    vim

# Defina o diretório de trabalho no contêiner
WORKDIR /workspaces

# Exponha a porta que a aplicação irá rodar
EXPOSE 3500

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]
