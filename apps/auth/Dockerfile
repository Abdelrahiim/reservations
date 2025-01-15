# -------------------- Build Stage --------------------
FROM  node:alpine as development

WORKDIR /usr/src/app

# Copy workspace config
COPY pnpm-workspace.yaml ./

# Copy root files first
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Copy source after installing dependencies
COPY apps/auth apps/auth
COPY libs libs
COPY proto proto
# Install pnpm and enable workspace feature
RUN npm install -g pnpm
RUN pnpm config set auto-install-peers true
RUN pnpm install -r

RUN pnpm run build auth

# -------------- PRODUCTION --------------

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Copy workspace config
COPY pnpm-workspace.yaml ./

# Copy package files
COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm config set auto-install-peers true
RUN pnpm install --prod

# Copy built files
COPY proto proto
COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/auth/main"]

