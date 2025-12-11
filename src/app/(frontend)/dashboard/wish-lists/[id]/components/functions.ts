import { graphqlRequest, gql } from '@/lib/graphql-client'
import { Item, ItemReturn } from '@/types/item'
import { List } from '@/types/list'

const CREATE_ITEM_MUTATION = gql`
  mutation CreateItem($item: ItemInput!) {
    createItem(data: $item) {
      id
    }
  }
`

const UPDATE_LIST_MUTATION = gql`
  mutation UpdateList($id: String!, $items: [String!]) {
    updateList(id: $id, data: { items: $items }) {
      id
    }
  }
`
export async function createItem(list: List, item: Item) {
  const createdItem = await graphqlRequest(CREATE_ITEM_MUTATION, item)

  const updatedList = await graphqlRequest(UPDATE_LIST_MUTATION, {
    id: list.id,
    items: [...list.items.map((item) => item.id), createdItem.id],
  })
  return updatedList.updateList
}

const DELETE_ITEM_MUTATION = gql`
  mutation DeleteItem($id: String!) {
    deleteItem(id: $id) {
      id
    }
  }
`

export async function deleteItem(itemId: Item['id']) {
  const deletedItem = await graphqlRequest(DELETE_ITEM_MUTATION, {
    id: itemId,
  })
  return deletedItem.deleteItem
}

const UPDATE_ITEM_MUTATION = gql`
  mutation UpdateItem($id: String!, $item: ItemInput!) {
    updateItem(id: $id, data: $item) {
      ${ItemReturn}
    }
  }
`
export async function updateItem(item: Item) {
  const updatedItem = await graphqlRequest(UPDATE_ITEM_MUTATION, {
    id: item.id,
    item,
  })
  return updatedItem.updateItem
}
