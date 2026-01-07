FROM ghcr.io/linkwarden/linkwarden:v2.13.5@sha256:1588811d7b7d249d387782bb94c7eb189082b82b542ac1667d2ac3d7e7f70ce6

COPY --chmod=775 /rootfs/docker-entrypoint.sh /

EXPOSE 3000

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD [ "yarn", "concurrently:start" ]
