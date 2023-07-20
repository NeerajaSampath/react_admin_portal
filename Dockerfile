FROM node:16.12.0 as build
WORKDIR /app
RUN chown -R node:node /app
USER node
COPY package.json .
COPY package-lock.json . 
RUN npm install
COPY . .
RUN npm run build
FROM m2pfintech01/infra_nginx:1.21.4 as server
COPY --from=build /app/build /usr/share/nginx/html
WORKDIR /home/nginx/
USER nginx
