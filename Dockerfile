FROM node:20-alpine

WORKDIR /app

# dependencies install
COPY package*.json yarn.lock* pnpm-lock.yaml* ./
RUN yarn install --frozen-lockfile || \
    npm install
 
# পুরো প্রজেক্ট কপি
COPY . .

EXPOSE 5000

# ts-node-dev দিয়ে dev mode
CMD ["yarn", "dev"]
