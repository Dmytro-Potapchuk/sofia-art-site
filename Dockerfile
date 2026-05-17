# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG REACT_APP_SUPABASE_URL
ARG REACT_APP_SUPABASE_ANON_KEY
ARG REACT_APP_WEB3FORMS_ACCESS_KEY

ENV REACT_APP_SUPABASE_URL=$REACT_APP_SUPABASE_URL \
    REACT_APP_SUPABASE_ANON_KEY=$REACT_APP_SUPABASE_ANON_KEY \
    REACT_APP_WEB3FORMS_ACCESS_KEY=$REACT_APP_WEB3FORMS_ACCESS_KEY \
    GENERATE_SOURCEMAP=false \
    CI=true

RUN npm run build

FROM nginx:1.27-alpine AS production

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
