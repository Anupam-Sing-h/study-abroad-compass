

# Fix AI Counsellor Conversation Context

## Problem
The frontend sends only the latest user message to the edge function, and the edge function sends only `[system, user]` to the AI — so every message is treated as a brand new conversation with no memory.

## Changes

### 1. Frontend: Send full conversation history (`src/pages/Counsellor.tsx`)
- In `sendMessage`, pass the entire `messages` array (including the new user message) to the edge function as `conversationHistory` instead of just `message`.

### 2. Edge Function: Forward conversation history (`supabase/functions/ai-counsellor/index.ts`)
- Accept `conversationHistory` from the request body.
- Build the AI messages array as `[system prompt, ...conversationHistory]` instead of `[system, single user message]`.
- This gives the AI full context of the ongoing conversation.

## Implementation Details

**Frontend change** — instead of:
```ts
body: { message: userMessage, studentProfile, profile }
```
Send:
```ts
const allMessages = [...messages, { role: 'user', content: userMessage }];
body: { conversationHistory: allMessages, studentProfile, profile }
```

**Edge function change** — instead of:
```ts
messages: [
  { role: "system", content: systemPrompt },
  { role: "user", content: message }
]
```
Use:
```ts
messages: [
  { role: "system", content: systemPrompt },
  ...conversationHistory
]
```

### Files to Modify
1. `src/pages/Counsellor.tsx`
2. `supabase/functions/ai-counsellor/index.ts`

