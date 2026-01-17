FROM node:22-slim AS builder

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /workspace

COPY package.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY apps/services/promotion ./apps/services/promotion
COPY libs ./libs

RUN npm install

RUN npx nx build promotion

FROM node:22-slim AS runner

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY --from=builder /workspace/dist/apps/services/promotion/package.json ./

# Copy Prisma Client đã được generate từ builder stage

ENV NODE_ENV=promotionion

RUN npm install --omit=dev

COPY --from=builder /workspace/node_modules/prisma ./node_modules/prisma
COPY --from=builder /workspace/node_modules/@prisma ./node_modules/@prisma

COPY --from=builder /workspace/dist ./dist

CMD ["node", "dist/apps/services/promotion/main.js"]
