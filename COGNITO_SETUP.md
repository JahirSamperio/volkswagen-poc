# Configuración de AWS Cognito con MFA

## 1. Crear User Pool

1. Ve a la consola de AWS Cognito
2. Haz clic en "Create user pool"
3. Configura los siguientes pasos:

### Paso 1: Configure sign-in experience
- **Authentication providers**: Cognito user pool
- **Cognito user pool sign-in options**: 
  - ✅ Email
  - ✅ Username (opcional)

### Paso 2: Configure security requirements
- **Password policy**: Custom
  - Minimum length: 8
  - ✅ Contains at least 1 number
  - ✅ Contains at least 1 special character
  - ✅ Contains at least 1 uppercase letter
  - ✅ Contains at least 1 lowercase letter

- **Multi-factor authentication**: Required
- **MFA methods**: 
  - ✅ Authenticator apps
  - ✅ SMS (opcional)

- **User account recovery**: 
  - ✅ Enable self-service account recovery
  - ✅ Email only

### Paso 3: Configure sign-up experience
- **Self-registration**: Enable self-registration
- **Attribute verification and user account confirmation**:
  - ✅ Send email verification messages
- **Required attributes**:
  - ✅ email
  - ✅ name (opcional)

### Paso 4: Configure message delivery
- **Email provider**: Send email with Cognito
- **SMS**: Default IAM role for SMS (si habilitaste SMS MFA)

### Paso 5: Integrate your app
- **User pool name**: `volkswagen-poc-users`
- **App client name**: `volkswagen-poc-client`
- **Client secret**: Generate a client secret (NO recomendado para apps web públicas)

## 2. Configurar App Client

Después de crear el User Pool:

1. Ve a tu User Pool creado
2. En la pestaña "App integration"
3. Haz clic en tu App client
4. Configura:
   - **Allowed callback URLs**: `http://localhost:5173/` (para desarrollo)
   - **Allowed sign-out URLs**: `http://localhost:5173/`
   - **OAuth 2.0 grant types**:
     - ✅ Authorization code grant
     - ✅ Implicit grant
   - **OpenID Connect scopes**:
     - ✅ openid
     - ✅ email
     - ✅ profile

## 3. Obtener configuración

Después de la configuración, anota los siguientes valores:

```javascript
const awsConfig = {
  region: 'us-east-1', // Tu región
  userPoolId: 'us-east-1_XXXXXXXXX', // User Pool ID
  userPoolWebClientId: 'xxxxxxxxxxxxxxxxxxxxxxxxxx', // App Client ID
};
```

## 4. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_AWS_REGION=us-east-1
VITE_AWS_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_AWS_USER_POOL_WEB_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 5. Instalación de dependencias

```bash
npm install aws-amplify qrcode.js
```

## Notas importantes

- El MFA será obligatorio para todos los usuarios
- En el primer inicio de sesión, se mostrará un QR para configurar la app autenticadora
- Los siguientes inicios solo requerirán el código MFA
- Las contraseñas temporales forzarán el cambio de contraseña