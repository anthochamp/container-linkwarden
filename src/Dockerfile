FROM ghcr.io/linkwarden/linkwarden:v2.10.0@sha256:44b845a559736a9b0e26d761072c847dd452c54dbe3fde7b417c76ef948abc68

COPY --chmod=775 /rootfs/docker-entrypoint.sh /

EXPOSE 3000

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD [ "yarn", "start" ]
