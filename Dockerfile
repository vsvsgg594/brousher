FROM public.ecr.aws/g5e2x5a9/node:20.11.1
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ENV NODE_OPTIONS=--max_old_space_size=4096
RUN npx tsc
EXPOSE 3000
CMD ["node", "dist/main.js"]
