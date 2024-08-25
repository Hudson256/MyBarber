# MyBarber

## Overview

**MyBarber** é uma plataforma web moderna desenvolvida para barbearias, permitindo que estas gerenciem seus horários, vejam agendamentos e interajam com seus clientes de maneira eficiente. O projeto foi desenvolvido utilizando tecnologias de ponta, proporcionando uma experiência rápida, responsiva e segura tanto para barbearias quanto para clientes.

## Funcionalidades Principais

- **Gerenciamento de Horários**: Barbearias podem adicionar, editar e excluir horários disponíveis para reservas.
- **Sistema de Avaliações**: Clientes podem avaliar os serviços prestados com um sistema de estrelas (1-5) e deixar comentários.
- **Autenticação Segura**: Implementação de OAuth com Google, garantindo segurança e facilidade de login para os usuários.
- **Interface Intuitiva**: Desenvolvido com React e Next.js, a interface é responsiva e fácil de navegar, oferecendo uma experiência de usuário otimizada.
- **Backend Robusto**: Utiliza Node.js com Prisma e PostgreSQL para uma gestão eficiente dos dados e alta performance.
- **Dockerizado**: O projeto é totalmente dockerizado, facilitando o deploy em qualquer ambiente.

## Tecnologias Utilizadas

- **Frontend**:
  - React
  - Next.js
  - Tailwind CSS
- **Backend**:
  - Node.js
  - Prisma ORM
  - PostgreSQL
- **Autenticação**:
  - NextAuth com OAuth via Google
- **Infraestrutura**:
  - Docker
- **Outros**:
  - TypeScript para tipagem estática
  - ESLint e Prettier para garantir qualidade de código
  - Lucide-react e Sonner para ícones e notificações

## Estrutura do Projeto

```bash
MyBarber/
├── api/                     # Endpoints da API
├── components/              # Componentes React reutilizáveis
├── constants/               # Constantes usadas no projeto
├── data/                    # Scripts para lidar com dados
├── pages/                   # Páginas da aplicação Next.js
│   └── manage-barbershop/   # Página de gerenciamento de barbearias
├── public/                  # Arquivos estáticos
├── styles/                  # Arquivos de estilo
├── utils/                   # Funções utilitárias
└── docker-compose.yml       # Configuração do Docker
```
## Como Rodar o Projeto
## Requisitos

- Node.js
- Docker
- Yarn ou NPM

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/Hudson256/MyBarber.git
   cd MyBarber```
2. Instale as dependências:

```bash
yarn install
# ou
npm install
```
3. Configure as variáveis de ambiente no arquivo .env.

4. Inicie o Docker:

```bash
docker-compose up -d
```
5.Rode as migrações do Prisma:
```bash
npx prisma migrate deploy
```
6.Inicie o servidor de desenvolvimento:
```bash
yarn dev
# ou
npm run dev
```
## Testes
O projeto inclui uma suíte de testes para garantir a estabilidade e a qualidade do código. Para rodar os testes, utilize o comando:
```bash
yarn test
# ou
npm run test
```
## Contribuições
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests. Este projeto segue o padrão de código estabelecido por ESLint e Prettier, então certifique-se de rodar o linter antes de submeter suas alterações.

## Licença
Este projeto é licenciado sob a licença MIT.

## Contato
Se você tiver alguma dúvida ou sugestão, entre em contato pelo e-mail: hudsono256@gmail.com.
