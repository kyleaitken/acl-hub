# syntax=docker/dockerfile:1

# Use a Ruby base image with specified version
ARG RUBY_VERSION=3.3.5
FROM ruby:$RUBY_VERSION-slim AS base

# Working directory
WORKDIR /rails

# Install essential packages
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y curl libjemalloc2 libvips postgresql-client && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Set environment variables for production
ENV RAILS_ENV="production" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development:test" \
    RAILS_LOG_TO_STDOUT="true" \
    RAILS_SERVE_STATIC_FILES="true" 

# Install gems separately in a build stage to reduce image size
FROM base AS build

# Install build dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential git libpq-dev pkg-config && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy Gemfile and install production gems
COPY Gemfile Gemfile.lock ./
RUN bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git

# Copy application code and precompile assets
COPY . .
RUN bundle exec bootsnap precompile app/ lib/

# Final production image
FROM base

# Copy compiled gems and app files from the build stage
COPY --from=build ${BUNDLE_PATH} ${BUNDLE_PATH}
COPY --from=build /rails /rails

# Create and use a non-root user
RUN groupadd --system rails && useradd --uid 1000 --gid rails --create-home --shell /bin/bash rails && \
    chown -R rails:rails /rails /rails/db /rails/log /rails/storage /rails/tmp

USER rails

RUN echo $PATH

# Set up entrypoint and server command
ENTRYPOINT ["bundle", "exec", "rails", "server"]
CMD ["-b", "0.0.0.0", "-p", "3000"]

# Expose application port
EXPOSE 3000
