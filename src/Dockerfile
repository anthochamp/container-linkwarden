FROM ghcr.io/linkwarden/linkwarden:v2.13.0@sha256:bd3565d3f13c2d590f417710819f4c6b4fe19f8b841fc45ab3fe4c61ba12d34f

COPY --chmod=775 /rootfs/docker-entrypoint.sh /

EXPOSE 3000

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD [ "yarn", "concurrently:start" ]
