FROM ghcr.io/linkwarden/linkwarden:v2.11.4@sha256:7ab9442d10b9779ed61f82aacd54b9afc647cd611bb44111dc6835b41a9a6088

COPY --chmod=775 /rootfs/docker-entrypoint.sh /

EXPOSE 3000

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD [ "yarn", "concurrently:start" ]
