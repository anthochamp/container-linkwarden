FROM ghcr.io/linkwarden/linkwarden:v2.11.7@sha256:be0aef0dbbfafb518bcf98c0e35af14183a54795d899d42f3fae8bd7b5610ed9

COPY --chmod=775 /rootfs/docker-entrypoint.sh /

EXPOSE 3000

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD [ "yarn", "concurrently:start" ]
