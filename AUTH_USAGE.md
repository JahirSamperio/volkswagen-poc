# Uso del Sistema de Autenticación con MFA

## Instalación

1. Instalar las dependencias:
```bash
npm install
```

2. Configurar las variables de entorno:
```bash
cp .env.example .env
```

3. Editar el archivo `.env` con tus valores de AWS Cognito:
```env
VITE_AWS_REGION=us-east-1
VITE_AWS_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_AWS_USER_POOL_WEB_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Flujo de Autenticación

### 1. Primer Inicio de Sesión
- El usuario ingresa sus credenciales
- Si es la primera vez, se le pedirá cambiar la contraseña temporal
- Después del cambio de contraseña, se mostrará un código QR para configurar MFA
- El usuario escanea el QR con su app autenticadora (Google Authenticator, Authy, etc.)
- Ingresa el código de 6 dígitos para completar la configuración

### 2. Inicios de Sesión Posteriores
- El usuario ingresa sus credenciales
- Se le solicita el código MFA de 6 dígitos
- Una vez verificado, accede a la aplicación

### 3. Cerrar Sesión
- Hacer clic en el botón "Cerrar Sesión" en el Dashboard

## Componentes Creados

### Carpeta: `src/components/auth/`

- **AuthProvider.jsx**: Proveedor de contexto para el estado de autenticación
- **AuthContainer.jsx**: Contenedor principal que maneja el flujo de autenticación
- **LoginForm.jsx**: Formulario de inicio de sesión
- **MfaSetup.jsx**: Componente para configurar y verificar MFA
- **ChangePassword.jsx**: Componente para cambiar contraseña temporal
- **LogoutButton.jsx**: Botón para cerrar sesión
- **auth.css**: Estilos para los componentes de autenticación

## Características

- ✅ Autenticación con AWS Cognito
- ✅ MFA obligatorio con TOTP (Time-based One-Time Password)
- ✅ Cambio de contraseña temporal automático
- ✅ Configuración de MFA con código QR
- ✅ Persistencia de sesión
- ✅ Manejo de errores
- ✅ Interfaz responsive
- ✅ Integración completa con la aplicación existente

## Apps Autenticadoras Recomendadas

- Google Authenticator
- Microsoft Authenticator
- Authy
- 1Password
- Bitwarden

## Seguridad

- Las contraseñas deben tener mínimo 8 caracteres
- Deben incluir mayúsculas, minúsculas, números y símbolos especiales
- MFA es obligatorio para todos los usuarios
- Las sesiones se mantienen seguras con AWS Cognito