FROM ghcr.io/linkwarden/linkwarden:v2.12.1@sha256:19774e821de6601bef2adfe67a2bb595fcebfb6ae91a7509449634d184ff005f

COPY --chmod=775 /rootfs/docker-entrypoint.sh /

EXPOSE 3000

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD [ "yarn", "concurrently:start" ]
