# Real-time Messaging Setup Guide

This app now includes real-time messaging powered by Pusher. Messages can be sent to families or events.

## Prerequisites

1. Create a Pusher account at https://pusher.com
2. Create a new app in your Pusher dashboard
3. Get your credentials:
   - App ID
   - Key
   - Secret
   - Cluster (e.g., "us2", "eu", etc.)

## Environment Variables

Add these to your `.env` file:

```env
# Pusher Server-side (required)
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=your_cluster

# Pusher Client-side (required)
NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
```

## Usage

### Basic Usage

Import and use the `MessageThread` component:

```tsx
import MessageThread from '@/components/MessageThread'

// For family messages
<MessageThread
  familyId="family-id-here"
  title="Family Chat"
/>

// For event messages
<MessageThread
  eventId="event-id-here"
  title="Event Discussion"
/>

// For direct messages between users
<MessageThread
  userId="user-id-here"
  title="Direct Message"
/>
```

Or use the `MessageDialog` component for a popup interface:

```tsx
import MessageDialog from '@/components/MessageDialog'

// For family messages
<MessageDialog family={family} />

// For event messages
<MessageDialog event={event} />

// For direct messages
<MessageDialog user={user} />
```

### Using the Hook Directly

If you need more control, use the `useMessages` hook:

```tsx
import { useMessages } from '@/hooks/use-messages'

function MyComponent({ familyId }: { familyId: string }) {
  const { messages, isLoading, sendMessage, isConnected } = useMessages({
    familyId,
    enabled: true,
  })

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>{message.content}</div>
      ))}
      <button onClick={() => sendMessage('Hello!')}>Send</button>
    </div>
  )
}

// For direct messages
function DirectMessageComponent({ userId }: { userId: string }) {
  const { messages, sendMessage } = useMessages({
    userId,
    enabled: true,
  })

  // ... render messages
}
```

## Features

- ✅ Real-time message delivery via Pusher
- ✅ Message persistence in Payload CMS
- ✅ Access control (users can only see messages from families/events they're part of)
- ✅ Auto-scrolling message list
- ✅ Connection status indicator
- ✅ Optimistic UI updates
- ✅ Typing indicator support (can be added)

## Message Collection

Messages are stored in the `message` collection with the following structure:

- `content` (textarea) - The message text
- `sender` (relationship to users) - Who sent the message
- `family` (relationship to family, optional) - If message is for a family
- `event` (relationship to event, optional) - If message is for an event
- `recipient` (relationship to users, optional) - If message is a direct message
- `createdAt` / `updatedAt` - Timestamps

**Note:** A message can be for a family, event, OR a direct message (recipient), but not multiple at once.

## Access Control

- Users can only read messages from:
  - Families they are members of
  - Events they are invited to or created
  - Direct messages where they are the sender or recipient
- Users can only create messages if they have access to the family/event, or if they can see the recipient user
- Users can only update/delete their own messages
- Super admins have full access
- Users cannot send direct messages to themselves

## Example Integration

### Add to Family Page

```tsx
// src/app/(frontend)/dashboard/families/[id]/page.tsx
import MessageThread from '@/components/MessageThread'

export default function FamilyPage({ params }: { params: { id: string } }) {
  return (
    <div>
      {/* Other family content */}
      <MessageThread familyId={params.id} title="Family Chat" />
    </div>
  )
}
```

### Add to Event Page

```tsx
// src/app/(frontend)/dashboard/events/[id]/page.tsx
import MessageThread from '@/components/MessageThread'

export default function EventPage({ params }: { params: { id: string } }) {
  return (
    <div>
      {/* Other event content */}
      <MessageThread eventId={params.id} title="Event Discussion" />
    </div>
  )
}
```

### Add Direct Messaging to Member Page

```tsx
// src/app/(frontend)/dashboard/members/[id]/page.tsx
import MessageThread from '@/components/MessageThread'
// or
import MessageDialog from '@/components/MessageDialog'

export default async function MemberPage({ params }: { params: { id: string } }) {
  const member = await getMember(params.id)

  return (
    <div>
      <MemberHeader member={member} />

      {/* Option 1: Full thread component */}
      <MessageThread userId={member.id} title={`Chat with ${member.name}`} />

      {/* Option 2: Dialog popup */}
      <MessageDialog user={member} />
    </div>
  )
}
```

### Add Message Button to Member Card

```tsx
// src/components/MemberCard.tsx
import MessageDialog from '@/components/MessageDialog'

export default function MemberCard({ member, isManager }: Props) {
  const { user } = useAuth()
  const isSelf = user?.id === member.id

  return (
    <Card>
      {/* ... other content ... */}
      <CardFooter>
        {!isSelf && <MessageDialog user={member} />}
        <Button asChild>
          <Link href={`/dashboard/members/${member.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
```

## Troubleshooting

### Messages not appearing in real-time

1. Check that Pusher environment variables are set correctly
2. Verify your Pusher app is active in the dashboard
3. Check browser console for connection errors
4. Ensure the user has access to the family/event

### Connection status shows "Connecting..."

- Check network connectivity
- Verify Pusher credentials
- Check browser console for errors
- Ensure Pusher app is not paused in dashboard

## Threads List

You can get a list of all threads a user has access to using the `useThreads` hook:

```tsx
import { useThreads } from '@/hooks/use-threads'

function ThreadsList() {
  const { data: threads, isLoading } = useThreads()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {threads?.map((thread) => (
        <div key={`${thread.type}-${thread.id}`}>
          <h3>{thread.name}</h3>
          {thread.lastMessage && (
            <p>{thread.lastMessage.content}</p>
          )}
        </div>
      ))}
    </div>
  )
}
```

The threads API endpoint (`/api/messages/threads`) returns:
- **Family threads**: All families the user is a member of
- **Event threads**: All events the user is invited to or created
- **Direct message threads**: All users the current user has exchanged messages with

Each thread includes:
- `type`: 'family' | 'event' | 'direct'
- `id`: The thread identifier
- `name`: Display name
- `lastMessage`: Preview of the last message (if any)
- `lastMessageAt`: Timestamp of last message
- `participant`: For direct messages, the other user's info

Threads are sorted by `lastMessageAt` (most recent first), with threads without messages at the end.

## Next Steps

Consider adding:

- Typing indicators
- Read receipts
- Message reactions
- File attachments
- Message search
- Push notifications
- Unread message counts
- Thread search/filtering
