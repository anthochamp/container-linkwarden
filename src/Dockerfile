FROM ghcr.io/linkwarden/linkwarden:v2.10.1@sha256:4b178ca72762b291e053b236b58034c66f5774827953af8a469bf21c8681ff6c

COPY --chmod=775 /rootfs/docker-entrypoint.sh /

EXPOSE 3000

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD [ "yarn", "start" ]
