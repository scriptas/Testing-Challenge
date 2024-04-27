FROM node:20-bookworm

WORKDIR /usr/src/app

COPY package*.json ./

RUN npx -y playwright@1.43.0 install --with-deps
RUN npm install
RUN npx playwright install chrome
RUN npx playwright install msedge

COPY . .

CMD [ "/bin/bash" ]

# Build: docker build -t playwright-testing-challenges .
# Run: docker run -it --rm -t playwright-testing-challenges 