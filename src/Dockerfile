FROM ghcr.io/linkwarden/linkwarden:v2.13.1@sha256:54271afa4fc34107f98d9ba580e320e3bd5b3e02339f7d68947d01a375ea7bb3

COPY --chmod=775 /rootfs/docker-entrypoint.sh /

EXPOSE 3000

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD [ "yarn", "concurrently:start" ]
