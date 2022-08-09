FROM node:14
WORKDIR /usr/src/app

RUN apt-get update && \
  apt-get install --no-install-recommends -y \
  libgtk2.0-0 \
  libgtk-3-0 \
  libnotify-dev \
  libgconf-2-4 \
  libgbm-dev \
  libnss3 \
  libxss1 \
  libasound2 \
  libxtst6 \
  xauth \
  xvfb \
  # install Chinese fonts
  # this list was copied from https://github.com/jim3ma/docker-leanote
  fonts-arphic-bkai00mp \
  fonts-arphic-bsmi00lp \
  fonts-arphic-gbsn00lp \
  fonts-arphic-gkai00mp \
  fonts-arphic-ukai \
  fonts-arphic-uming \
  ttf-wqy-zenhei \
  ttf-wqy-microhei \
  xfonts-wqy \
  # clean up
  && rm -rf /var/lib/apt/lists/*




COPY --chown=node:node . .

RUN tar xvjf runbotic-desktop/driver/linux/firefox-88.0b8.tar.bz2 && rm runbotic-desktop/driver/linux/firefox-88.0b8.tar.bz2
RUN tar xvf runbotic-desktop/driver/linux/geckodriver-v0.29.0-linux64.tar.gz && rm runbotic-desktop/driver/linux/geckodriver-v0.29.0-linux64.tar.gz

ENV CFG_FIREFOX_BIN='./driver/linux/firefox/firefox-bin'
ENV CFG_GECKO_DRIVER='./driver/linux'


USER node


# Set necessary environment variables.
ENV NODE_ENV=production \
    NPM_CONFIG_PREFIX=/home/node/.npm-global \
    PATH=$PATH:/home/node/.npm-global/bin:/home/node/node_modules/.bin:$PATH

# Change ownership of the working directory to the node:node user:group
# This ensures that npm install can be executed successfully with the correct permissions
RUN chown -R node:node /usr/src/app/runbotic-desktop

# Set the user to use when running this image
# Non previlage mode for better security (this user comes with official NodeJS image).


# Set the default working directory for the app
# It is a best practice to use the /usr/src/app directory




# Display directory structure
RUN ls -l

WORKDIR /usr/src/app/runbotic-desktop

# Run the web service on container startup
CMD node ../create-links.js create ; node dist/main
