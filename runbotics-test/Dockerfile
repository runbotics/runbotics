FROM node:20

WORKDIR /app

COPY . .
RUN npm install
RUN npx playwright install --with-deps

CMD ["npm", "run", "test"]