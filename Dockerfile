FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY frontend/blog/package*.json ./frontend/blog/
COPY frontend/photos/package*.json ./frontend/photos/

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/frontend/index.html /usr/share/nginx/html/
COPY --from=builder /app/frontend/style.css /usr/share/nginx/html/
COPY --from=builder /app/frontend/script.js /usr/share/nginx/html/
COPY --from=builder /app/frontend/reset.css /usr/share/nginx/html/

COPY --from=builder /app/frontend/about_me /usr/share/nginx/html/about_me
COPY --from=builder /app/frontend/assets /usr/share/nginx/html/assets
COPY --from=builder /app/frontend/fonts /usr/share/nginx/html/fonts
COPY --from=builder /app/frontend/links /usr/share/nginx/html/links
COPY --from=builder /app/frontend/404 /usr/share/nginx/html/404

COPY --from=builder /app/frontend/blog/_site /usr/share/nginx/html/blog
COPY --from=builder /app/frontend/photos/_site /usr/share/nginx/html/photos
COPY --from=builder /app/frontend/guestbook /usr/share/nginx/html/guestbook

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
