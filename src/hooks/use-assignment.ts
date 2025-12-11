import { graphqlRequest } from '@/lib/graphql-client'
import { Assignment as PayloadAssignment } from '@/payload-types'
import { Assignment, AssignmentReturn } from '@/types/secret-santa'
import { useQuery } from '@tanstack/react-query'
import { gql } from 'graphql-request'

const ASSIGNMENT_QUERY = gql`
  query GetAssignment($id: ID!) {
    Assignment(id: $id) {
      ${AssignmentReturn}
    }
  }
`

type GetAssignmentResponse = {
  Assignment: Assignment
}

export async function getAssignment(id: string) {
  const response = await graphqlRequest<GetAssignmentResponse>(ASSIGNMENT_QUERY, { id })
  return response.Assignment
}

export function useAssignment(id: string) {
  return useQuery({
    queryKey: ['assignment', { id }],
    queryFn: async () => {
      return await getAssignment(id)
    },
  })
}
