export const API_CONFIG = {
  BASE_URL: 'https://172.50.66.153:3000/api/v1',
  ENDPOINTS: {
    DEPLOY: '/deploy',
    DESTROY: '/destroy'
  },
  // TODO: Integrar con AWS Cognito para obtener el user_id real
  DEFAULT_USER_ID: '123'
}