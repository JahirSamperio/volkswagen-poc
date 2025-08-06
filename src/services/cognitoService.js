export const cognitoService = {
  getUserId() {
    try {
      // Buscar el token de acceso en localStorage
      const keys = Object.keys(localStorage)
      const accessTokenKey = keys.find(key => 
        key.includes('CognitoIdentityServiceProvider') && key.includes('accessToken')
      )
      
      if (!accessTokenKey) return null
      
      const token = localStorage.getItem(accessTokenKey)
      if (!token) return null
      
      // Decodificar el JWT para obtener el sub (user_id)
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.sub
    } catch (error) {
      console.error('Error getting user ID from Cognito:', error)
      return null
    }
  }
}