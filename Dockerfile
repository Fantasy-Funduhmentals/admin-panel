FROM node:16 as dependencies
WORKDIR /app
COPY package.json yarn.lock ./
COPY yarn install
# install dependencies 
FROM node:16 as builder
WORKDIR /build
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN yarn build
# build the project
FROM node:16 as runner
WORKDIR /my-project
# If you are using a custom next.config.js file, uncomment this line.
# COPY --from=builder /my-project/next.config.js ./
COPY --from=builder /build/public ./public
COPY --from=builder /build/.next ./.next
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package.json ./package.json

EXPOSE 80
CMD ["yarn", "start"]