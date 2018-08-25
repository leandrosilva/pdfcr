#!/usr/bin/env sh
docker build -t pdfcr .
docker container rm -f pdfcr_dev
docker run -p 8080:80 --name pdfcr_dev pdfcr