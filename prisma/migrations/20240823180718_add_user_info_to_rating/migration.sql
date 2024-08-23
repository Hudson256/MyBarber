-- Adiciona as colunas com valores padrão temporários
ALTER TABLE "Rating"
ADD COLUMN "updatedAt" TIMESTAMP(3) DEFAULT now(),
ADD COLUMN "userAvatar" TEXT DEFAULT 'default-avatar-url',
ADD COLUMN "userName" TEXT DEFAULT 'default-username';

-- Atualiza os registros existentes para garantir que os valores padrão sejam aplicados
UPDATE "Rating"
SET "updatedAt" = now(),
    "userAvatar" = 'default-avatar-url',
    "userName" = 'default-username';

-- Altera as colunas para `NOT NULL`
ALTER TABLE "Rating"
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "userName" SET NOT NULL;

-- Se desejar, remova o valor padrão da coluna `userAvatar` após atualizar os dados
ALTER TABLE "Rating"
ALTER COLUMN "userAvatar" DROP DEFAULT;
