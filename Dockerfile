FROM node:latest
ADD ./ /etc/easy-ci
RUN apt-get update
RUN apt-get install -y git
RUN mkdir /root/.ssh/
RUN touch /root/.ssh/known_hosts
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts
WORKDIR "/etc/easy-ci"
RUN cd /etc/easy-ci && npm install
ENTRYPOINT ["npm","start"]
EXPOSE 7654
