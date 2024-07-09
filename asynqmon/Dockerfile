# First stage: Building the frontend
FROM node:20-alpine AS frontend

# Move to a working directory (/static)
WORKDIR /static

# Install dependencies and build the frontend
COPY ui .
RUN yarn install && yarn build

# Second stage: Building the backend
FROM golang:1.18-alpine AS backend

# Move to a working directory (/build)
WORKDIR /build

# Copy and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code to the container
COPY . .

# Copy frontend static files from /static to the root folder of the backend container
COPY --from=frontend /static/build ui/build

# Set necessary environment variables and build the server
ENV CGO_ENABLED=0 GOOS=linux GOARCH=amd64
RUN go build -ldflags="-s -w" -o asynqmon ./cmd/asynqmon

# Third stage: Creating and running a new scratch container with the backend binary
FROM scratch

# Copy binary from /build to the root folder of the scratch container
COPY --from=backend /build/asynqmon /

# Command to run when starting the container
ENTRYPOINT ["/asynqmon"]
