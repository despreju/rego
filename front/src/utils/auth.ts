export function setAccessToken(token: string) {
  sessionStorage.setItem('rego-token', token)
}

export function getAccessToken(): string | null {
  // Replace with your actual logic to retrieve the access token
  return sessionStorage.getItem('rego-token');
}

export function removeAccessToken(): void {
  sessionStorage.removeItem('rego-token');
}