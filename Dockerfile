# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.22.1

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

# Own the workdir as the non-root 'node' user before installing, so node_modules
# (and Vite's cache dir inside it) stay writable by the user that runs the app.
RUN chown node:node /usr/src/app
USER node

# Download dependencies as a separate step to take advantage of Docker's caching.
# This needs devDependencies too (vite, typescript, tailwindcss), so don't --omit=dev.
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source files into the image.
COPY --chown=node:node . .

# Vite's dev server default port; vite.config.ts binds it to 0.0.0.0 so it's
# reachable from outside the container.
EXPOSE 5173

# Run the application.
CMD ["npm", "run", "dev"]