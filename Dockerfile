FROM davehansen/nodejs-jdk8-jessie

ENV HOME /Frontend-Starter-Kit
ENV NODE 7
ENV DEBIAN_FRONTEND noninteractive
ENV PATH $HOME/.yarn/bin:$PATH

WORKDIR ${HOME}
ADD . $HOME
RUN apt-get update && \
    apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_$NODE.x | bash - && \
    curl -o- -L https://yarnpkg.com/install.sh | bash && \
    apt-get update && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

RUN java -version
RUN node -v
RUN npm -v
RUN yarn

EXPOSE 3000 9876
