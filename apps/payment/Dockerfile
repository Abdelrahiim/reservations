
# -------------------- Build Stage --------------------
FROM  node:alpine as development

WORKDIR /usr/src/app

COPY pnpm-workspace.yaml ./


COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY nest-cli.json ./

COPY apps/payment apps/payment
COPY libs libs

# Install pnpm and enable workspace feature
RUN npm install -g pnpm
RUN pnpm config set auto-install-peers true
RUN pnpm install -r

RUN pnpm run build payment

# -------------- PRODUCTION --------------

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/payment/main"]

