FROM ghcr.io/linkwarden/linkwarden:v2.9.3@sha256:0d9ab9dcf70aaf81fddbaf2d215a057670fff5eb01ef7cfd97b08900ffcddd1c

COPY --chmod=775 /rootfs/docker-entrypoint.sh /

EXPOSE 3000

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD [ "yarn", "start" ]
