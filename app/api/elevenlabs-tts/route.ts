import { NextRequest, NextResponse } from 'next/server'

// ElevenLabs API endpoint for text-to-speech
export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    const apiKey = process.env.ELEVENLABS_API_KEY
    
    // Hardcoded optimal settings for conversational AI
    // Using latest v3 models and American female voices
    const voiceId = 'XB0fDUnXU5powFXDhCwa' // Charlotte - Natural American female
    // Alternative American female voices (uncomment to use):
    // const voiceId = 'EXAVITQu4vr4xnSDxMaL' // Bella - Warm, friendly American
    // const voiceId = 'MF3mGyEYCl7XYWbV9V6O' // Elli - Energetic American
    // const voiceId = 'jsCqWAovK2LkecY7zXl4' // Freya - Professional American
    // const voiceId = 'jBpfuIE2acCO8z3wKNLl' // Gigi - Young American childish
    // const voiceId = 'pMsXgVXv3BLzUgSXRplE' // Serena - Warm American middle-aged
    
    // Using the latest Eleven v3 model for most natural conversation
    const modelId = 'eleven_turbo_v2_5' // Fast, good quality
    // Alternative models (uncomment to use):
    // const modelId = 'eleven_multilingual_v2' // Most natural, supports 29 languages
    // const modelId = 'eleven_monolingual_v1' // Best for English only
    
    // Optimized voice settings for natural conversation
    const stability = 0.65 // Lower = more expressive, Higher = more consistent
    const similarityBoost = 0.75 // Voice clarity
    const style = 0.35 // Lower = more neutral, Higher = more emotional
    const useSpeakerBoost = true // Enhances voice clarity

    // Check if API key is not set or is still the placeholder
    if (!apiKey || apiKey === 'your-elevenlabs-api-key-here') {
      console.log('ElevenLabs API key not configured - falling back to browser TTS')
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      )
    }

    // Call ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model_id: modelId,
          voice_settings: {
            stability: stability,
            similarity_boost: similarityBoost,
            style: style,
            use_speaker_boost: useSpeakerBoost
          }
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('ElevenLabs Error:', error)
      return NextResponse.json(
        { error: 'Failed to generate speech' },
        { status: response.status }
      )
    }

    // Get the audio stream
    const audioBuffer = await response.arrayBuffer()

    // Return the audio
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache',
      },
    })
    
  } catch (error) {
    console.error('TTS Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    )
  }
}

/**
 * ElevenLabs Voice IDs (some popular ones):
 * 
 * YOUNG FEMALE (Best for Sales):
 * - EXAVITQu4vr4xnSDxMaL - Bella (warm, friendly)
 * - MF3mGyEYCl7XYWbV9V6O - Elli (energetic)
 * - jsCqWAovK2LkecY7zXl4 - Freya (professional)
 * 
 * MATURE FEMALE:
 * - ThT5KcBeYPX3keUQqHPh - Dorothy (british)
 * - oWAxZDx7w5VEj9dCyTzz - Grace (smooth)
 * 
 * MALE:
 * - TxGEqnHWrfWFTfGW9XjX - Josh (young, casual)
 * - VR6AewLTigWG4xSOukaG - Arnold (deep)
 * 
 * Get more voices at: https://elevenlabs.io/voice-library
 */