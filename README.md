# Servia 🔧

Plataforma de intermediação de serviços que conecta **prestadores autônomos, MEIs e pequenas empresas** a potenciais clientes. Sem taxa por lead, sem barreiras de entrada.

---

## Estrutura do projeto

```
servia/
├── servia-api/     → Backend (Node.js + Express + TypeScript + PostgreSQL)
└── servia-web/     → Frontend (Next.js 14 + Tailwind CSS + TypeScript)
```

---

## Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

---

## 1. Configurar o banco de dados

```bash
# Criar o banco
createdb servia

# Rodar o schema (cria tabelas, índices, categorias iniciais)
psql -d servia -f servia-api/src/config/schema.sql
```

---

## 2. Configurar e rodar a API

```bash
cd servia-api

# Copiar e preencher variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do PostgreSQL e um JWT_SECRET forte

# Instalar dependências (já instaladas se seguiu o setup)
npm install

# Rodar em modo desenvolvimento
npm run dev
```

A API sobe em `http://localhost:3001`

**Health check:** `GET http://localhost:3001/health`

---

## 3. Configurar e rodar o frontend

```bash
cd servia-web

# O .env.local já está configurado para apontar para localhost:3001
# Apenas instale as dependências e rode:
npm install
npm run dev
```

O frontend sobe em `http://localhost:3000`

---

## Endpoints da API

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Criar conta |
| POST | `/api/auth/login` | Fazer login |
| GET | `/api/auth/me` | Dados do usuário logado |

### Prestadores
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/providers` | Listar/buscar prestadores |
| GET | `/api/providers/me` | Meu perfil (autenticado) |
| GET | `/api/providers/:id` | Perfil público |
| POST | `/api/providers` | Criar perfil (autenticado) |
| PATCH | `/api/providers/:id` | Editar perfil (autenticado) |
| GET | `/api/providers/:id/reviews` | Avaliações do prestador |
| POST | `/api/providers/:id/reviews` | Criar avaliação (autenticado) |
| POST | `/api/providers/:id/contact` | Registrar contato |

### Categorias e Painel
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/categories` | Listar categorias |
| GET | `/api/categories/dashboard` | Métricas do prestador logado |

### Query params para busca
```
GET /api/providers?search=eletricista&city=Salvador&state=BA&category=eletricista&plan=pro&page=1&limit=12
```

---

## Páginas do frontend

| Rota | Descrição |
|------|-----------|
| `/` | Homepage com hero, categorias e CTA |
| `/buscar` | Busca com filtros por texto, cidade e categoria |
| `/prestador/:id` | Perfil público do prestador + avaliações |
| `/login` | Login |
| `/cadastro` | Cadastro (cliente ou prestador) |
| `/meu-perfil` | Painel do prestador autenticado |

---

## Modelo de negócio

| Plano | Preço | Benefícios |
|-------|-------|------------|
| **Free** | Grátis | Perfil completo, aparece nas buscas, contatos ilimitados |
| **Destaque** | ~R$ 39/mês | Aparece no topo, selo destaque, estatísticas |
| **Pro** | ~R$ 99/mês | Tudo do Destaque + portfólio, agenda, relatórios |

---

## Roadmap

- [x] Fase 1 — MVP (autenticação, perfis, busca, avaliações, contato via WhatsApp)
- [ ] Fase 2 — Planos pagos (Stripe), SEO, analytics
- [ ] Fase 3 — App mobile (React Native), chat interno, agendamento
- [ ] Fase 4 — Pagamentos intermediados, API para parceiros

---

## Stack

**Backend:** Node.js · Express · TypeScript · PostgreSQL · JWT · bcryptjs  
**Frontend:** Next.js 14 (App Router) · Tailwind CSS · TypeScript · Lucide Icons
