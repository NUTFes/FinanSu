FROM golang:latest

WORKDIR /app
COPY . /app

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y locales \
  && locale-gen ja_JP.UTF-8 \
  && echo "export LANG=ja_JP.UTF-8" >> ~/.bashrc

RUN export LANG=C.UTF-8
RUN export LANGUAGE=en_US:

ENV CGO_ENABLED=0
ENV GOOS=linux
#ENV GOARCH=amd64

# swaggerをinstall
RUN go install github.com/swaggo/swag/cmd/swag@latest

# Airをインストール
RUN go install github.com/cosmtrek/air && go build -o /go/bin/air github.com/cosmtrek/air
CMD ["air", "-c", ".air.toml"]


