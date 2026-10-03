FROM ghcr.io/linkwarden/linkwarden:v2.16.3@sha256:0664c28a039bda8ffa6663389e8536b2fc717219e329f85b83faca7efed3b144

COPY --chmod=775 /rootfs/docker-entrypoint.sh /

EXPOSE 3000

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD [ "yarn", "concurrently:start" ]
