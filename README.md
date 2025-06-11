# Tech challange
## Dependencias
- Docker
    Usado para criar um banco mongo. A lib indicada no documento para um banco em memoria se mostrou extremamente instavel.
- [PNPM](https://pnpm.io/workspaces)
    Rapido, otimiza espaco em disco e o suporte para monorepo é muito interessante.
- [Turborepo](https://turborepo.com/docs)
    Vem com muita coisa pronta para monorepos, facilita o setup e oferece uam serie de facilidades.
- Node

## Como rodar
1. Instale as dependencias com PNPM.
´´´sh
pnpn install
´´´
2. Inicie o docker compose
´´´sh
docker compose -f apps/tagme-bff/docker-compose.yml up
´´´
3. Rode o ambiente de desenvolvimento
´´´sh
pnpm run dev
´´´

## Frontend
### Tecnologias
- [Angular](https://angular.dev/)
- [Angular Material](https://material.angular.dev/)
### Resumo
Essa etapa foi, de longe, a mais desafiadora do processo. Digo isso porque Angular não é uma tecnologia com a qual tenho afinidade, na verdade, essa foi a primeira vez que mexi com Angular!. A ideia de trabalhar com uma estrutura tão carregada, baseada em classes no front-end, é bem diferente do que costumo estudar ou utilizar no meu dia a dia.

Tenho preferência por programação funcional e por bibliotecas como o React, então acabo não explorando muito o Angular. No entanto, trabalhando com desenvolvimento web, entendo que, no fim das contas, todos buscamos a mesma coisa: manipular o DOM.

Tive alguma dificuldade no início para me adaptar ao boilerplate e à estrutura do Angular, mas o framework se mostrou bem ágil e relativamente simples de usar, uma vez que entendi a proposta.

Pela minha pouca experiência com Angular, optei por não me aventurar muito na reatividade e seguir um caminho mais padrão para lidar com estados e rotas. Utilizei a URL e o fluxo nativo de navegação para atualizar listas e lidar com paginação. Gosto desse modelo porque acredito que oferece uma experiência de usuário fluida de maneira simples.

Manter o estado da aplicação via URL é uma prática que tento adotar sempre que possível. Em cenários como dashboards, isso se torna especialmente útil: a URL funciona como uma espécie de “query” que o cliente pode compartilhar ou salvar, garantindo consistência e facilidade no acesso às informações.

Considerei me aprofundar e aplicar Server-Side Rendering (SSR) para tornar as páginas da tabela e de edição renderizadas no servidor, oferecendo uma experiência mais rápida e otimizada para o cliente. Já a tela de cadastro permaneceria como uma página estática, por se tratar de um fluxo mais simples e com menor impacto na performance inicial.

## Backend
## Tecnologias
- NestJS
- Multer

### Resumo
Lidar com nestJS faz parte do meu dia a dia. Nessa etapa, utilizei bastante da CLI do proprio nest para criar boa parte do codigo e ajustei para receber as imagens.
