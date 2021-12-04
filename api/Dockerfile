FROM golang:latest

WORKDIR /app
COPY . /app

RUN apt-get update
RUN apt-get upgrade -y

ENV CGO_ENABLED=0
ENV GOOS=linux
ENV GOARCH=amd64

RUN go get -u github.com/cosmtrek/air
