import { GraphQLClient } from 'graphql-request'
import gql from 'graphql-tag'

const getGraphQLClient = () => {
  return new GraphQLClient(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/graphql`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

// Export a singleton client instance
export const graphqlClient = getGraphQLClient()

// Export the gql template tag for better syntax highlighting and static analysis
export { gql }

// Helper function for making GraphQL requests
// Accepts either a string or a DocumentNode from gql template tag
export async function graphqlRequest<T = any>(
  query: string | ReturnType<typeof gql>,
  variables?: Record<string, any>,
): Promise<T> {
  try {
    const data = await graphqlClient.request<T>(query, variables)
    return data
  } catch (error: any) {
    // Extract GraphQL errors if available
    if (error?.response?.errors) {
      const errorMessage = error.response.errors[0]?.message || 'GraphQL request failed'
      console.error(errorMessage)
      throw new Error(errorMessage)
    }
    throw error
  }
}
