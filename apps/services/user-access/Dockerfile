FROM node:22-slim AS builder

WORKDIR /workspace

RUN apt-get update && apt-get install -y openssl

COPY package*.json ./
COPY nx.json ./
COPY tsconfig.*.json ./

COPY apps/services/user-access ./apps/services/user-access
COPY libs ./libs

RUN npm install

RUN npx nx build user-access

FROM node:22-slim AS runner

WORKDIR /app

RUN apt-get update && apt-get install -y openssl

COPY --from=builder /workspace/dist/apps/services/user-access/package.json ./

ENV NODE_ENV=production

RUN npm install --omit=dev

COPY --from=builder /workspace/dist ./dist

CMD ["node", "dist/apps/services/user-access/main.js"]