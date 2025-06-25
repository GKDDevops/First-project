FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=5000
ENV MONGODB_URI="mongodb+srv://gkgcpdevops:72JWnbE1qUN8RJJC@cluster0.nykegii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

EXPOSE 5000

CMD ["npm", "start"]
