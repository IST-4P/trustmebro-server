FROM node:22-slim AS builder

RUN npm install -g pnpm

WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY nx.json ./
COPY tsconfig.*.json ./
COPY apps/services/user-access ./apps/services/user-access
COPY libs ./libs

RUN pnpm install

RUN pnpm nx build user-access

FROM node:22-slim AS runner

RUN npm install -g pnpm

WORKDIR /app

COPY --from=builder /workspace/dist/apps/services/user-access/package.json ./
COPY --from=builder /workspace/dist/apps/services/user-access/pnpm-lock.yaml ./

ENV NODE_ENV=production

RUN npm install --omit=dev

COPY --from=builder /workspace/dist ./dist
COPY --from=builder /workspace/libs/interfaces/src/lib/protos ./proto

CMD ["node", "dist/apps/services/user-access/main.js"]