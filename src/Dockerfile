FROM ghcr.io/linkwarden/linkwarden:v2.16.2@sha256:f4dd1790cef8de5b923dd5c0239e8861c3600500e3d234dab655dad0303d3a7f

COPY --chmod=775 /rootfs/docker-entrypoint.sh /

EXPOSE 3000

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD [ "yarn", "concurrently:start" ]
