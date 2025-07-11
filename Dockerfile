FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy rest of the source code
COPY . .

# Generate Prisma client inside container
RUN npx prisma generate
RUN npx prisma db push

EXPOSE 3000

CMD ["npm", "run", "dev"]
