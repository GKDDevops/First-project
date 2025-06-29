FROM gcr.io/google.com/cloudsdktool/google-cloud-cli:alpine

# Install essential tools
RUN apk add --no-cache \
    docker \
    git \
    python3 \
    nodejs \
    npm \
    bash

# Install kubectl using gcloud (requires bash)
RUN gcloud components install kubectl

# Optional: verify installations
RUN docker --version && \
    git --version && \
    python3 --version && \
    node --version && \
    npm --version && \
    kubectl version --client && \
    gcloud --version

CMD ["sh", "-c", "cat"]
