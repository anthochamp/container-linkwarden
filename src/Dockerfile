FROM ghcr.io/linkwarden/linkwarden:v2.10.2@sha256:c448740684ba24b6866294df4d45bc9e1ff0d48b17401f3502cb7d169c11cf55

COPY --chmod=775 /rootfs/docker-entrypoint.sh /

EXPOSE 3000

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD [ "yarn", "start" ]
