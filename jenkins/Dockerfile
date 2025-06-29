FROM gcr.io/google.com/cloudsdktool/google-cloud-cli:alpine

# Install essential tools
RUN apk add --no-cache \
    docker \
    git \
    python3 \
    nodejs \
    npm \
    bash

# Install kubectl and gke-gcloud-auth-plugin
RUN gcloud components install kubectl gke-gcloud-auth-plugin --quiet

# Verify installations
RUN docker --version && \
    git --version && \
    python3 --version && \
    node --version && \
    npm --version && \
    kubectl version --client && \
    gcloud --version && \
    gke-gcloud-auth-plugin --version

# Set default command
CMD ["sh", "-c", "cat"]
