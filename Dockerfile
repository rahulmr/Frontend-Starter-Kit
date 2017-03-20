FROM davehansen/nodejs-jdk8-jessie:latest

ENV HOME /Frontend-Starter-Kit
ENV NODE 7
ENV DEBIAN_FRONTEND noninteractive
ENV PATH $HOME/.yarn/bin:$PATH

WORKDIR ${HOME}
ADD . $HOME

RUN npm install -g yarn gulp

RUN yarn

EXPOSE 3000 9876
