
# Plan: Add Speech-to-Text and Text-to-Speech to AI Onboarding

## Overview
This plan adds voice interaction capabilities to the AI-led onboarding experience, allowing students to speak their answers and hear AI responses read aloud using ElevenLabs' real-time STT and TTS APIs.

## Architecture

```text
+-------------------+     +------------------+     +-------------------+
|   AIOnboarding    |     |  Edge Functions  |     |    ElevenLabs     |
|    Component      |     |                  |     |       API         |
+-------------------+     +------------------+     +-------------------+
        |                         |                        |
        |-- Mic Recording ------->|                        |
        |                         |-- STT Request -------->|
        |                         |<-- Transcription ------|
        |<-- User Text -----------|                        |
        |                         |                        |
        |-- AI Response Text ---->|                        |
        |                         |-- TTS Request -------->|
        |                         |<-- Audio Stream -------|
        |<-- Play Audio ----------|                        |
+-------------------+     +------------------+     +-------------------+
```

## Implementation Steps

### Step 1: Connect ElevenLabs API
Use the ElevenLabs connector to set up the API key as an environment variable.

### Step 2: Create TTS Edge Function
Create a new edge function `elevenlabs-tts` that:
- Receives text from the client
- Calls ElevenLabs TTS API with a professional, warm voice (e.g., "Sarah" or "George")
- Returns audio as binary data for playback

### Step 3: Create STT Token Edge Function
Create a new edge function `elevenlabs-scribe-token` that:
- Generates a single-use token for real-time STT
- Returns the token to the client for WebSocket connection

### Step 4: Install ElevenLabs React SDK
Add `@elevenlabs/react` package for real-time speech-to-text using the `useScribe` hook.

### Step 5: Update AIOnboarding Component
Enhance the component with:
- Voice mode toggle button
- Microphone button for voice input (using `useScribe` hook)
- Auto-play TTS when AI responds
- Visual indicators for recording/speaking states
- Fallback to text input when voice is unavailable

### Step 6: Update Supabase Config
Add the new edge functions to `supabase/config.toml`.

## Technical Details

### New Edge Functions

**1. `supabase/functions/elevenlabs-tts/index.ts`**
- Accepts `{ text, voiceId? }` in request body
- Uses voice "EXAVITQu4vr4xnSDxMaL" (Sarah - warm, professional female voice)
- Returns MP3 audio binary
- Uses `ELEVENLABS_API_KEY` environment variable

**2. `supabase/functions/elevenlabs-scribe-token/index.ts`**
- Generates single-use token for real-time transcription
- Token valid for 15 minutes
- Used by `useScribe` hook on client

### Enhanced AIOnboarding Component

```text
+------------------------------------------+
|           AI Onboarding Chat             |
+------------------------------------------+
|                                          |
|  [Bot] Hi! I'm your AI Counsellor...     |
|                                          |
|         [User] Bachelor's degree         |
|                                          |
|  [Bot] Great! What's your major?    [🔊] |
|                                          |
+------------------------------------------+
|  [Type or speak...]         [🎤] [Send]  |
|  [ ] Enable Voice Mode                   |
+------------------------------------------+
```

Features:
- Toggle switch for voice mode
- Microphone button with pulsing animation when recording
- Speaker icon on AI messages to replay audio
- Visual transcript updates as user speaks
- Automatic TTS playback when AI responds

### Dependencies
- `@elevenlabs/react` - For real-time STT via `useScribe` hook
- ElevenLabs API Key via connector

### Voice Settings
- **TTS Voice**: Sarah (EXAVITQu4vr4xnSDxMaL) - warm, professional
- **Model**: eleven_turbo_v2_5 (low latency, good quality)
- **STT Model**: scribe_v2_realtime with VAD (voice activity detection)

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `supabase/functions/elevenlabs-tts/index.ts` | Create | TTS edge function |
| `supabase/functions/elevenlabs-scribe-token/index.ts` | Create | STT token generator |
| `supabase/config.toml` | Modify | Add new function configs |
| `src/components/onboarding/AIOnboarding.tsx` | Modify | Add voice UI and logic |
| `package.json` | Modify | Add @elevenlabs/react |

## User Experience Flow

1. User selects "AI-Led Conversation" on onboarding
2. Voice mode toggle appears (off by default)
3. User enables voice mode
4. Browser requests microphone permission
5. AI greeting plays via TTS automatically
6. User taps mic button to answer
7. Real-time transcription shows as user speaks
8. User stops speaking (VAD detects silence) or taps mic again
9. Transcription becomes the answer
10. AI responds with next question (plays via TTS)
11. Repeat until onboarding complete

## Error Handling
- Graceful fallback to text-only if microphone denied
- Toast notifications for API errors
- Retry logic for network issues
- Clear loading states during TTS/STT processing

## Accessibility Considerations
- Voice mode is optional, text always available
- Visual indicators sync with audio states
- Transcripts visible for all spoken content
