FROM ghcr.io/linkwarden/linkwarden:v2.11.6@sha256:fd22f2c614f885d0f9284ae2a28876366e2f988d17d3abb0427f9850735f7f92

COPY --chmod=775 /rootfs/docker-entrypoint.sh /

EXPOSE 3000

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD [ "yarn", "concurrently:start" ]
