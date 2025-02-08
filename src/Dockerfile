FROM ghcr.io/linkwarden/linkwarden:v2.9.3

COPY --chmod=775 /rootfs/docker-entrypoint.sh /

EXPOSE 3000

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD [ "yarn", "start" ]
