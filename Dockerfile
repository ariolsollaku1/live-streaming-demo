FROM node:18-alpine

# Install OpenVPN
# RUN apk --no-cache add openvpn

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env.prod .env

COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

EXPOSE 3031

CMD ["/entrypoint.sh"]