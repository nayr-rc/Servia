-- Servia — Schema inicial
-- Execute este arquivo no seu banco PostgreSQL antes de iniciar a API

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Usuários (clientes e prestadores)
CREATE TABLE IF NOT EXISTS users (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         VARCHAR(120) NOT NULL,
  email        VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role         VARCHAR(20) NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'provider', 'admin')),
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categorias de serviço
CREATE TABLE IF NOT EXISTS categories (
  id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name  VARCHAR(80) UNIQUE NOT NULL,
  slug  VARCHAR(80) UNIQUE NOT NULL,
  icon  VARCHAR(40)
);

-- Perfis de prestadores
CREATE TABLE IF NOT EXISTS providers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name  VARCHAR(120) NOT NULL,
  bio           TEXT,
  city          VARCHAR(100) NOT NULL,
  state         CHAR(2) NOT NULL,
  whatsapp      VARCHAR(20),
  photo_url     TEXT,
  plan          VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'destaque', 'pro')),
  avg_rating    NUMERIC(3,2) DEFAULT 0,
  review_count  INTEGER DEFAULT 0,
  verified      BOOLEAN DEFAULT FALSE,
  active        BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Relação prestador x categorias
CREATE TABLE IF NOT EXISTS provider_categories (
  provider_id  UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  category_id  UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (provider_id, category_id)
);

-- Avaliações
CREATE TABLE IF NOT EXISTS reviews (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id  UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating       SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (provider_id, user_id)
);

-- Contatos (log de quem entrou em contato com quem)
CREATE TABLE IF NOT EXISTS contacts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id  UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  channel      VARCHAR(20) DEFAULT 'whatsapp' CHECK (channel IN ('whatsapp', 'chat', 'form')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_providers_city       ON providers(city);
CREATE INDEX IF NOT EXISTS idx_providers_state      ON providers(state);
CREATE INDEX IF NOT EXISTS idx_providers_plan       ON providers(plan);
CREATE INDEX IF NOT EXISTS idx_providers_active     ON providers(active);
CREATE INDEX IF NOT EXISTS idx_provider_categories_cat ON provider_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_reviews_provider     ON reviews(provider_id);

-- Trigger para atualizar avg_rating após cada review
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE providers
  SET
    avg_rating   = (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews WHERE provider_id = NEW.provider_id),
    review_count = (SELECT COUNT(*) FROM reviews WHERE provider_id = NEW.provider_id),
    updated_at   = NOW()
  WHERE id = NEW.provider_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_rating ON reviews;
CREATE TRIGGER trg_update_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

-- Categorias iniciais
INSERT INTO categories (name, slug, icon) VALUES
  ('Reformas e Construção', 'reformas', 'ti-tools'),
  ('Encanamento', 'encanamento', 'ti-droplet'),
  ('Eletricista', 'eletricista', 'ti-bolt'),
  ('Limpeza', 'limpeza', 'ti-sparkles'),
  ('Jardinagem', 'jardinagem', 'ti-plant'),
  ('Pintura', 'pintura', 'ti-paint'),
  ('Tecnologia e TI', 'tecnologia', 'ti-device-laptop'),
  ('Design e Criação', 'design', 'ti-palette'),
  ('Aulas e Cursos', 'aulas', 'ti-book'),
  ('Beleza e Estética', 'beleza', 'ti-scissors'),
  ('Fotografia', 'fotografia', 'ti-camera'),
  ('Transporte e Mudança', 'transporte', 'ti-truck'),
  ('Culinária e Buffet', 'culinaria', 'ti-chef-hat'),
  ('Saúde e Bem-estar', 'saude', 'ti-heart'),
  ('Contabilidade e Finanças', 'contabilidade', 'ti-calculator'),
  ('Advocacia e Jurídico', 'juridico', 'ti-gavel'),
  ('Animais de Estimação', 'pets', 'ti-paw'),
  ('Eventos e Festas', 'eventos', 'ti-confetti'),
  ('Marketing e Redes Sociais', 'marketing', 'ti-brand-instagram'),
  ('Outros', 'outros', 'ti-grid')
ON CONFLICT (slug) DO NOTHING;
