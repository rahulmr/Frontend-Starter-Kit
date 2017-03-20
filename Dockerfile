FROM buildpack-deps:jessie

ENV HOME /Frontend-Starter-Kit
ENV NODE 7
ENV DEBIAN_FRONTEND noninteractive
ENV PATH $HOME/.yarn/bin:$PATH

WORKDIR ${HOME}
ADD . $HOME

RUN curl -sL https://deb.nodesource.com/setup_$NODE.x | bash - && \
    curl -o- -L https://yarnpkg.com/install.sh | bash && \
    apt-get install software-properties-common && \
    add-apt-repository ppa:webupd8team/java && \
    apt-get update && \
    apt-get install -y \
      nodejs \
      oracle-java8-installer \
      --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

RUN yarn

EXPOSE 3000 9876
