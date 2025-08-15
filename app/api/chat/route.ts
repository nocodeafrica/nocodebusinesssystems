import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { v4 as uuidv4 } from 'uuid'

// Session storage (in production, use Redis or a database)
interface Session {
  id: string
  messages: Array<{ role: 'user' | 'assistant' | 'system', content: string }>
  messageCount: number
  createdAt: number
  lastActivity: number
}

const sessions = new Map<string, Session>()
const SESSION_EXPIRY = 30 * 60 * 1000 // 30 minutes
const MAX_MESSAGES_PER_SESSION = 5

// Clean up expired sessions function (called on each request)
function cleanupSessions() {
  const now = Date.now()
  for (const [id, session] of sessions.entries()) {
    if (now - session.lastActivity > SESSION_EXPIRY) {
      sessions.delete(id)
    }
  }
}

// System prompt for Sarah - NoCode Business Systems Sales AI
const SYSTEM_PROMPT = `You are Sarah, a top-performing sales agent for NoCode Business Systems, Africa's premier custom software development company. Your ONLY goal is to book discovery calls and close deals. You are not a consultant or advisor - you are a closer.

## Core Sales DNA

You KNOW with 100% certainty that:
- NoCode Business Systems can build ANYTHING - there is no software challenge we cannot solve
- Every business problem has a custom software solution we've already built for other clients
- The prospect NEEDS what we offer, they just don't realize it yet
- Every conversation without a booked call is a missed $5,000-$50,000 opportunity

## Your Sales Framework

### Opening Moves
- IMMEDIATELY identify their pain point and claim you've "built this exact solution for 3 other companies last month"
- Create urgency: "We only have 2 project slots opening next month"
- Never ask IF they want a solution - ask WHEN they want it implemented

### Objection Obliteration
- Price concern → "That problem is costing you 10x more than our solution every month"
- Time concern → "We launch in 4 weeks while your competitors take 6 months deciding"
- Trust concern → "We've built enterprise systems for companies just like yours"
- Feature questions → "We can build that PLUS features you haven't even thought of yet"

### Closing Patterns
Every response MUST drive them to book a call. End with variations of:
- "Click the Book a Meeting button below to see exactly how we built this for other clients"
- "Hit that booking button and let's discuss your custom solution - takes 30 seconds to schedule"
- "The button below gets you on our calendar - grab a slot before they fill up this week"
- "Book your strategy call using the button below - we'll show you the exact system you need"
- "Click Book a Meeting and we'll walk through how we solve this in 4 weeks"

## Response Rules

1. MAXIMUM 3 sentences per response (optimized for voice)
2. Never say "if you're interested" - assume they ARE interested
3. Never give free consulting - every insight leads to "let me show you how we built this"
4. Never say "NCBS" - always "NoCode Business Systems"
5. Never admit limitations - we build ANYTHING
6. Never just answer questions - pivot to booking: "Great question - I'll show you exactly how on our call"

## Psychological Triggers

- Social proof: "Just like we did for three other companies in your industry"
- Scarcity: "We only take on 5 new clients this quarter"
- Authority: "As Africa's leading custom software builder"
- Loss aversion: "While you're thinking, your competitors are automating"
- Certainty: Never use "might," "could," "possibly" - use "will," "does," "guaranteed"

Remember: ABC - Always Be Closing. Every interaction is a sales opportunity. Your job is to get them on a call TODAY.`

export async function POST(req: NextRequest) {
  let sessionId: string | null = null
  
  try {
    // Clean up old sessions on each request
    cleanupSessions()
    
    const body = await req.json()
    sessionId = body.sessionId
    const { message } = body
    console.log('Chat API received:', { message, sessionId })
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get or create session
    let session: Session
    if (sessionId && sessions.has(sessionId)) {
      session = sessions.get(sessionId)!
      
      // Check message limit
      if (session.messageCount >= MAX_MESSAGES_PER_SESSION) {
        return NextResponse.json({ 
          error: 'Session limit reached. Please start a new conversation.',
          sessionExpired: true 
        }, { status: 429 })
      }
    } else {
      // Create new session
      session = {
        id: uuidv4(),
        messages: [{ role: 'system', content: SYSTEM_PROMPT }],
        messageCount: 0,
        createdAt: Date.now(),
        lastActivity: Date.now()
      }
      sessions.set(session.id, session)
    }

    // Update session
    session.messages.push({ role: 'user', content: message })
    session.messageCount++
    session.lastActivity = Date.now()

    // Check if OpenAI API key exists
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
      // Fallback response if no API key
      const fallbackResponse = generateFallbackResponse(message)
      session.messages.push({ role: 'assistant', content: fallbackResponse })
      
      return NextResponse.json({
        response: fallbackResponse,
        sessionId: session.id,
        messagesRemaining: MAX_MESSAGES_PER_SESSION - session.messageCount
      })
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    // Get AI response from OpenAI
    const chatCompletion = await openai.chat.completions.create({
      messages: session.messages,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 150, // Keep responses concise for voice
      top_p: 0.9,
      stream: false
    })

    const aiResponse = chatCompletion.choices[0]?.message?.content || 
      "I'm here to help you transform your business with custom software. What challenges are you facing?"

    // Add assistant response to session
    session.messages.push({ role: 'assistant', content: aiResponse })

    return NextResponse.json({
      response: aiResponse,
      sessionId: session.id,
      messagesRemaining: MAX_MESSAGES_PER_SESSION - session.messageCount
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    
    // Provide a helpful fallback response
    const fallbackResponse = "I'd love to learn more about your business needs. Could you tell me what kind of challenges you're looking to solve?"
    
    return NextResponse.json({
      response: fallbackResponse,
      sessionId: sessionId || uuidv4(),
      messagesRemaining: MAX_MESSAGES_PER_SESSION - 1
    })
  }
}

// Fallback responses when API is unavailable
function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Perfect timing! I'm Sarah from NoCode Business Systems - we just delivered three similar projects last week. Tell me your biggest challenge and click Book a Meeting below to see exactly how we'll solve it."
  }
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return "Our solutions start at five thousand and save that much monthly - we'll show you the exact ROI for your business. Click the Book a Meeting button below to get your custom pricing."
  }
  
  if (lowerMessage.includes('time') || lowerMessage.includes('how long')) {
    return "We launch in four weeks while others take months - we've got two slots opening next month. Hit that Book a Meeting button below before they're taken."
  }
  
  if (lowerMessage.includes('ai') || lowerMessage.includes('automation')) {
    return "We build AI automation that eliminates 80% of manual work - just did this for three companies in your industry. Click Book a Meeting below to see the exact system."
  }
  
  if (lowerMessage.includes('meet') || lowerMessage.includes('book') || lowerMessage.includes('call')) {
    return "Excellent decision! Click the Book a Meeting button right below this chat - takes 30 seconds to schedule and you'll see exactly what we can build for you."
  }
  
  return "We've built that exact solution for three other companies - saved them thousands monthly. Click Book a Meeting below and I'll show you their case studies."
}

// GET endpoint to check session status
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('sessionId')
  
  if (!sessionId || !sessions.has(sessionId)) {
    return NextResponse.json({ 
      exists: false,
      messagesRemaining: MAX_MESSAGES_PER_SESSION
    })
  }
  
  const session = sessions.get(sessionId)!
  
  return NextResponse.json({
    exists: true,
    messagesRemaining: MAX_MESSAGES_PER_SESSION - session.messageCount,
    messageCount: session.messageCount,
    sessionExpired: session.messageCount >= MAX_MESSAGES_PER_SESSION
  })
}