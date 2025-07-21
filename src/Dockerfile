FROM ghcr.io/linkwarden/linkwarden:v2.11.5@sha256:4d0d1261f6cefcd5752708f357b3aa355da3432fb4a023672890c8707217f914

COPY --chmod=775 /rootfs/docker-entrypoint.sh /

EXPOSE 3000

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD [ "yarn", "concurrently:start" ]
