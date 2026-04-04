FROM ghcr.io/linkwarden/linkwarden:v2.14.0@sha256:c5b9b4db571c468270cd916acebd5e6490b54393d90c1a2ccb9919a194ed7d51

COPY --chmod=775 /rootfs/docker-entrypoint.sh /

EXPOSE 3000

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD [ "yarn", "concurrently:start" ]
