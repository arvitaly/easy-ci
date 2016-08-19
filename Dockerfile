FROM node:latest
ADD ./ /etc/easy-ci
RUN mkdir /etc/easy-ci
RUN mkdir /var/easy-ci
RUN apt-get update
RUN apt-get install -y git
RUN touch /root/.ssh/known_hosts
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts
WORKDIR "/var/easy-ci"
RUN cd /etc/easy-ci && npm install
RUN eval "$(ssh-agent -s)"
ENTRYPOINT ["npm","start"]
EXPOSE 9090
