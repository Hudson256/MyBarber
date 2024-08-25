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

## Requisitos

- Node.js
- Docker
- Yarn ou NPM

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seuusuario/MyBarber.git
   cd MyBarber
