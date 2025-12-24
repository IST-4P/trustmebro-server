# FROM node:22-slim AS builder

# RUN npm install -g pnpm

# RUN apt-get update -y && apt-get install -y openssl

# WORKDIR /workspace

# COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# COPY nx.json ./
# COPY tsconfig*.json ./
# COPY apps/services/user-access ./apps/services/user-access
# COPY libs ./libs

# RUN pnpm install
# RUN pnpm nx build user-access

# FROM node:22-slim AS runner

# RUN npm install -g pnpm

# RUN apt-get update -y && apt-get install -y openssl

# WORKDIR /app

# COPY --from=builder /workspace/dist/apps/services/user-access/package.json ./
# COPY --from=builder /workspace/dist/apps/services/user-access/pnpm-lock.yaml ./

# # Copy Prisma Client đã được generate từ builder stage
# # COPY --from=builder /workspace/node_modules/prisma ./node_modules/prisma
# # COPY --from=builder /workspace/node_modules/@prisma ./node_modules/@prisma

# ENV NODE_ENV=production

# RUN npm install --omit=dev

# COPY --from=builder /workspace/dist ./dist

# CMD ["node", "dist/apps/services/user-access/main.js"]

FROM node:22-slim AS builder

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /workspace

COPY package.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY apps/services/user-access ./apps/services/user-access
COPY libs ./libs

RUN npm install

RUN npx nx build user-access

FROM node:22-slim AS runner

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY --from=builder /workspace/dist/apps/services/user-access/package.json ./

# Copy Prisma Client đã được generate từ builder stage

ENV NODE_ENV=production

RUN npm install --omit=dev

COPY --from=builder /workspace/node_modules/prisma ./node_modules/prisma
COPY --from=builder /workspace/node_modules/@prisma ./node_modules/@prisma

COPY --from=builder /workspace/dist ./dist

CMD ["node", "dist/apps/services/user-access/main.js"]
