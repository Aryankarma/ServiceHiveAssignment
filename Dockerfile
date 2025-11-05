# # Multi-stage build for backend and frontend

# # Stage 1: Build frontend
# FROM node:18-alpine AS frontend-builder
# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .
# RUN npm run build:frontend

# # Stage 2: Build and run backend
# FROM node:18-alpine
# WORKDIR /app

# # Install dependencies
# COPY package*.json ./
# RUN npm install --omit=dev

# # Copy built frontend
# COPY --from=frontend-builder /app/dist ./dist

# # Copy backend source
# COPY src/backend ./src/backend
# COPY tsconfig.json ./

# EXPOSE 5000

# ENV MONGODB_URI=mongodb://mongo:27017/slot-swapper
# ENV JWT_SECRET=your_jwt_secret_change_me
# ENV FRONTEND_URL=http://localhost:3000
# ENV NODE_ENV=production

# CMD ["npm", "start"]


# Stage 1: install deps and build frontend
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM deps AS frontend-builder
WORKDIR /app
COPY . .
# build only frontend
RUN npm run build:frontend

# Stage 2: compile backend (tsc) into dist
FROM deps AS backend-builder
WORKDIR /app
COPY . .
RUN npm run build:backend

# Stage 3: final runtime image
FROM node:18-alpine AS runtime
WORKDIR /app

# copy only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# copy compiled frontend and backend
COPY --from=frontend-builder /app/dist ./dist        # built frontend output
COPY --from=backend-builder /app/dist/backend ./dist/backend
# if your backend expects other assets, copy them too:
# COPY src/backend/views ./dist/backend/views

# copy any required runtime files (env, etc)
COPY tsconfig.json ./

EXPOSE 5000
ENV NODE_ENV=production

CMD ["npm", "start"]
