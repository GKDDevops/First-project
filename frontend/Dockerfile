FROM node:20-alpine  
WORKDIR /app  
COPY package*.json ./  
# Install dependencies including web-vitals  
RUN npm install  
# Explicitly install web-vitals if not in package.json  
RUN npm install web-vitals --save-dev  
COPY . .  
EXPOSE 3000  
CMD ["npm", "start"]  
