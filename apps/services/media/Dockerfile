FROM node:22-slim AS builder

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

COPY package.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY apps/services/media ./apps/services/media
COPY libs ./libs

RUN npm install

RUN npx nx build media

FROM node:22-slim AS runner

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ffmpeg \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /workspace/dist/apps/services/media/package.json ./

# Copy Prisma Client đã được generate từ builder stage

ENV NODE_ENV=production

RUN ffmpeg -version && ffprobe -version

RUN npm install --omit=dev

COPY --from=builder /workspace/node_modules/prisma ./node_modules/prisma
COPY --from=builder /workspace/node_modules/@prisma ./node_modules/@prisma

COPY --from=builder /workspace/dist ./dist

CMD ["node", "dist/apps/services/media/main.js"]
