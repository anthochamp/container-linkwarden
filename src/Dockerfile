FROM ghcr.io/linkwarden/linkwarden:v2.12.2@sha256:c1c6f417ea566de2c2dac6e79353ee5f40cb6a44fd9dd3970c83e6fc098de1df

COPY --chmod=775 /rootfs/docker-entrypoint.sh /

EXPOSE 3000

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD [ "yarn", "concurrently:start" ]
