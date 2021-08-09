FROM nginx:alpine

COPY dist /opt/ng-auth-ui
COPY config/nginx.conf /etc/nginx/

WORKDIR /opt/ng-auth-ui

# for on-prem
RUN addgroup -S 101 && adduser -S 101 -G 101
RUN chown -R 101:101 /opt/ /tmp
RUN chmod 700 -R /opt
RUN chmod 700 -R /tmp
USER 101
# end on-prem

EXPOSE 8080

CMD sed -i "s|<\!-- captchaToken -->|<script>window.captchaToken = '$CAPTCHA_TOKEN'</script>|" index.html && \
  sed -i "s|<\!-- invisibleCaptchaToken -->|<script>window.invisibleCaptchaToken = '$INVISIBLE_CAPTCHA_TOKEN'</script>|" index.html && \
  sed -i "s|<\!-- segmentToken -->|<script>window.segmentToken = '$SEGMENT_TOKEN'</script>|" index.html && \
  sed -i "s|<\!-- bugsnagToken -->|<script>window.bugsnagToken = '$BUGSNAG_TOKEN'</script>|" index.html && \
  sed -i "s|<\!-- signupExposed -->|<script>window.signupExposed = '$SIGNUP_EXPOSED'</script>|" index.html && \
  sed -i "s|<\!-- gtmCDEnabled -->|<script>window.gtmCDEnabled = '$GTM_CD_ENABLED'</script>|" index.html && \
  nginx -c /etc/nginx/nginx.conf -g 'daemon off;'
