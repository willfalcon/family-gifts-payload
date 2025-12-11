import { graphqlRequest, gql } from '@/lib/graphql-client'
import { List, ListReturn } from '@/types/list'
import { List as PayloadList } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'
import { Item, ItemReturn } from '@/types/item'
import { useMemo, useState } from 'react'

type GetListResponse = {
  List: List
}

export async function getList(listId: string) {
  const data = await graphqlRequest<GetListResponse>(
    gql`
      query getList($id: String!) {
        List(id: $id) {
          ${ListReturn}
        }
      }
    `,
    {
      id: listId,
    },
  )
  return data.List
}

export function useList(listId: string) {
  return useQuery({
    queryKey: ['list', { id: listId }],
    queryFn: async (): Promise<List> => {
      return await getList(listId)
    },
  })
}

type GetItemResponse = {
  Item: Item
}

export async function getItem(itemId: string) {
  const data = await graphqlRequest<GetItemResponse>(
    gql`
      query getItem($id: String!) {
        Item(id: $id) {
          ${ItemReturn}
        }
      }
    `,
    {
      id: itemId,
    },
  )
  return data.Item
}

export function useItem(itemId: string) {
  return useQuery({
    queryKey: ['item', { id: itemId }],
    queryFn: async (): Promise<Item> => {
      return await getItem(itemId)
    },
  })
}
