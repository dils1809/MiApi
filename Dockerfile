FROM node:18

WORKDIR /app

# Copiá todo de una vez (incluye index.js, db.js, incidents.db, etc)
COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]
