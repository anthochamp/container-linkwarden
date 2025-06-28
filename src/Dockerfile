FROM ghcr.io/linkwarden/linkwarden:v2.11.2@sha256:ecf4f27b03741971cb8d68d25b4a772418d6ddf40947bdfbb8f9cda53a1faba2

COPY --chmod=775 /rootfs/docker-entrypoint.sh /

EXPOSE 3000

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD [ "yarn", "concurrently:start" ]
