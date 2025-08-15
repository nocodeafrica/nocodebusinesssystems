import { NextRequest, NextResponse } from 'next/server'

// OpenAI TTS Models
type TTSModel = 'tts-1' | 'tts-1-hd'

// OpenAI TTS Voices
type TTSVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'

// Audio formats supported by OpenAI
type AudioFormat = 'mp3' | 'opus' | 'aac' | 'flac' | 'wav' | 'pcm'

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Get configuration from environment variables
    const apiKey = process.env.OPENAI_API_KEY
    const voice = (process.env.TTS_VOICE || 'nova') as TTSVoice
    const model = (process.env.TTS_MODEL || 'tts-1') as TTSModel
    const format = (process.env.TTS_AUDIO_FORMAT || 'mp3') as AudioFormat
    const speed = parseFloat(process.env.TTS_SPEED || '1.1')

    if (!apiKey) {
      console.error('OpenAI API key not configured')
      return NextResponse.json(
        { error: 'TTS service not configured. Please add OPENAI_API_KEY to .env.local' },
        { status: 500 }
      )
    }

    // Call OpenAI TTS API
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        input: text,
        voice: voice,
        response_format: format,
        speed: speed,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenAI TTS Error:', error)
      return NextResponse.json(
        { error: 'Failed to generate speech', details: error },
        { status: response.status }
      )
    }

    // Get the audio data
    const audioBuffer = await response.arrayBuffer()

    // Return the audio with appropriate content type
    const contentType = getContentType(format)
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
      },
    })
    
  } catch (error) {
    console.error('TTS Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate speech', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Helper function to get content type based on format
function getContentType(format: AudioFormat): string {
  switch (format) {
    case 'mp3':
      return 'audio/mpeg'
    case 'opus':
      return 'audio/opus'
    case 'aac':
      return 'audio/aac'
    case 'flac':
      return 'audio/flac'
    case 'wav':
      return 'audio/wav'
    case 'pcm':
      return 'audio/pcm'
    default:
      return 'audio/mpeg'
  }
}

/*
 * OpenAI TTS Voice Descriptions:
 * 
 * FEMALE VOICES:
 * - nova: Bright, energetic, enthusiastic (Young Female) - BEST FOR SALES
 * - shimmer: Soft, gentle, soothing (Young Female) - Good for calming contexts
 * 
 * MALE VOICES:
 * - alloy: Natural, smooth, neutral (Can pass as neutral/young male)
 * - echo: Articulate, precise, clear (Young Male) - Good for technical content
 * - fable: Warm, engaging, storyteller-like (Young Male) - Good for narratives
 * - onyx: Deep, authoritative, commanding (Mature Male) - Good for authority
 * 
 * MODELS:
 * - tts-1: Standard quality, ~1s latency, $0.015 per 1K chars
 * - tts-1-hd: Higher quality, ~2s latency, $0.030 per 1K chars
 * 
 * TIPS:
 * - Use _text_ for slight emphasis
 * - Use __text__ for strong emphasis
 * - Nova + tts-1 + 1.1x speed = Perfect for sales demos
 * - For production, consider caching responses to reduce API calls
 */