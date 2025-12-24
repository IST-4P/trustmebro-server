FROM node:22-slim AS builder

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /workspace

COPY package.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY apps/services/order ./apps/services/order
COPY libs ./libs

RUN npm install

RUN npx nx build order

FROM node:22-slim AS runner

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY --from=builder /workspace/dist/apps/services/order/package.json ./

# Copy Prisma Client đã được generate từ builder stage

ENV NODE_ENV=production

RUN npm install --omit=dev

COPY --from=builder /workspace/node_modules/prisma ./node_modules/prisma
COPY --from=builder /workspace/node_modules/@prisma ./node_modules/@prisma

COPY --from=builder /workspace/dist ./dist

CMD ["node", "dist/apps/services/order/main.js"]
