FROM ghcr.io/linkwarden/linkwarden:v2.11.3@sha256:1ad4225684bcd084d71d0ee5c6b3f118f3ba1e8468ff490d9e3429e30c6a8fd5

COPY --chmod=775 /rootfs/docker-entrypoint.sh /

EXPOSE 3000

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD [ "yarn", "concurrently:start" ]
