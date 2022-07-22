FROM registry.access.redhat.com/ubi8/ubi-minimal:8.6-854
RUN microdnf install nginx

COPY dist /opt/ng-auth-ui
COPY config/nginx.conf /etc/nginx/

WORKDIR /opt/ng-auth-ui

RUN chmod +x -R /opt/ng-auth-ui
RUN chmod +x -R /tmp

EXPOSE 8080

CMD sed -i "s|<\!-- captchaToken -->|<script>window.captchaToken = '$CAPTCHA_TOKEN'</script>|" index.html && \
  sed -i "s|<\!-- invisibleCaptchaToken -->|<script>window.invisibleCaptchaToken = '$INVISIBLE_CAPTCHA_TOKEN'</script>|" index.html && \
  sed -i "s|<\!-- segmentToken -->|<script>window.segmentToken = '$SEGMENT_TOKEN'</script>|" index.html && \
  sed -i "s|<\!-- bugsnagToken -->|<script>window.bugsnagToken = '$BUGSNAG_TOKEN'</script>|" index.html && \
  sed -i "s|<\!-- signupExposed -->|<script>window.signupExposed = '$SIGNUP_EXPOSED'</script>|" index.html && \
  sed -i "s|<\!-- oauthDisabled -->|<script>window.oauthDisabled = '$OAUTH_DISABLED'</script>|" index.html && \
  sed -i "s|<\!-- deploymentType -->|<script>window.deploymentType = '$DEPLOYMENT_TYPE'</script>|" index.html && \
  sed -i "s|<\!-- apiUrl -->|<script>window.apiUrl = '$API_URL'</script>|" index.html && \
  sed -i "s|<\!-- expectedHostname -->|<script>window.expectedHostname = '$EXPECTED_HOSTNAME'</script>|" index.html && \
  sed -i "s|<\!-- isNewSignupEnabled -->|<script>window.isNewSignupEnabled = '$NEW_SIGNUP_ENABLED'</script>|" index.html && \
  nginx -c /etc/nginx/nginx.conf -g 'daemon off;'
