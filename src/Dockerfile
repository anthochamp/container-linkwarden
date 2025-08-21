FROM ghcr.io/linkwarden/linkwarden:v2.11.8@sha256:c51e2d947cfe5323775057e399da9d0dac41108fb4926391663c5b64c3df891c

COPY --chmod=775 /rootfs/docker-entrypoint.sh /

EXPOSE 3000

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD [ "yarn", "concurrently:start" ]
