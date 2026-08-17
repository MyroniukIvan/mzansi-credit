'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApplicationInput, ApplicationSummary } from 'shared'
import { apiFetch } from '@/config/api-client'

export const applicationKeys = {
  all: ['applications'] as const,
  detail: (id: string) => ['applications', id] as const,
}

function getApplications() {
  return apiFetch<ApplicationSummary[]>('/applications')
}

function createApplication(values: ApplicationInput) {
  return apiFetch<ApplicationSummary>('/applications', {
    method: 'POST',
    body: JSON.stringify(values),
  })
}

export function useApplications() {
  return useQuery({
    queryKey: applicationKeys.all,
    queryFn: getApplications,
  })
}

export function useSubmitApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createApplication,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: applicationKeys.all }),
  })
}
