FROM ghcr.io/linkwarden/linkwarden:v2.16.0@sha256:d805877fb707d160b809027c302f84cfba11a248d7fdc12de90b4791f98e6b55

COPY --chmod=775 /rootfs/docker-entrypoint.sh /

EXPOSE 3000

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD [ "yarn", "concurrently:start" ]
