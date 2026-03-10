# Linkwarden Container Images

Container images based on the [official Linkwarden image](https://github.com/linkwarden/linkwarden), a self-hosted, open-source collaborative bookmark manager.

Sources are available on [GitHub](https://github.com/anthochamp/container-linkwarden).

See [README.md](README.md) for full documentation and configuration reference.

## Image tags

- `x.y.z-linkwardenA.B.C`: Container image version `x.y.z` with Linkwarden `A.B.C`.
- `edge-linkwardenA.B.C`: Latest commit build with Linkwarden `A.B.C`.

**Tag aliases:**

- `x.y-linkwardenA.B.C`: Latest patch of `x.y` with Linkwarden `A.B.C`.
- `x-linkwardenA.B.C`: Latest minor+patch of `x` with Linkwarden `A.B.C`.
- `x.y.z`: Version `x.y.z` with latest Linkwarden (only latest container version updated).
- `x.y`: Latest patch of `x.y` with latest Linkwarden (only latest container major.minor updated).
- `x`: Latest minor+patch of `x` with latest Linkwarden (only latest container major updated).
- `linkwardenA.B`: Latest container with latest patch of Linkwarden `A.B`.
- `linkwardenA`: Latest container with latest minor+patch of Linkwarden `A`.
- `latest`: Latest `x.y.z-linkwardenA.B.C` tag.
- `edge-linkwardenA.B`: Latest commit build with latest patch of Linkwarden `A.B`.
- `edge-linkwardenA`: Latest commit build with latest minor+patch of Linkwarden `A`.
- `edge`: Latest `edge-linkwardenA.B.C` tag.
