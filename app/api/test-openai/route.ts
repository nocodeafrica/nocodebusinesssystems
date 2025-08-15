import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'OPENAI_API_KEY not found in environment variables',
        env: {
          hasKey: false,
          keyLength: 0,
          keyPrefix: 'Not set'
        }
      })
    }

    // Show key info without exposing it
    const keyInfo = {
      hasKey: true,
      keyLength: apiKey.length,
      keyPrefix: apiKey.substring(0, 7) + '...',
      keyFormat: apiKey.startsWith('sk-') ? 'Valid format (starts with sk-)' : 'Invalid format (should start with sk-)',
      voice: process.env.TTS_VOICE || 'nova',
      model: process.env.TTS_MODEL || 'tts-1',
      speed: process.env.TTS_SPEED || '1.1'
    }

    // Test the API key with a simple request
    const testResponse = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    })

    if (testResponse.ok) {
      const models = await testResponse.json()
      return NextResponse.json({
        success: true,
        message: 'OpenAI API key is valid!',
        env: keyInfo,
        availableModels: models.data.filter((m: any) => m.id.includes('tts')).map((m: any) => m.id)
      })
    } else {
      const error = await testResponse.text()
      return NextResponse.json({
        success: false,
        error: 'Invalid API key or API error',
        details: error,
        env: keyInfo,
        status: testResponse.status
      })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to test API key',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}