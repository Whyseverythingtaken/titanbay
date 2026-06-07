FROM node:20-alpine
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm exec prisma generate
RUN pnpm build

ENV NODE_ENV=production

CMD ["sh", "-c", "pnpm exec prisma migrate deploy && node dist/index.js"]
