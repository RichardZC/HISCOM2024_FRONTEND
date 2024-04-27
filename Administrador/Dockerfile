FROM node:14-alpine
COPY . Hiscom/
WORKDIR /Hiscom
RUN npm install
RUN npm run build

ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
EXPOSE 3000
CMD ["npm", "run", "start"]
