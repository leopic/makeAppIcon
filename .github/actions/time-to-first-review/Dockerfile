FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

RUN pwd && ls -la

# Run the script
CMD ["node", "time-to-first-review.js"]