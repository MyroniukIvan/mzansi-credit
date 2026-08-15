export const Routes = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  APPLY: '/apply',
  APPLICATIONS: '/dashboard/applications',
  DOCUMENTS: '/dashboard/documents',
  OFFICE: '/office',
  OFFICE_APPLICATION: (id: string) => `/office/applications/${id}`,
  LEGAL: '/legal',
}
