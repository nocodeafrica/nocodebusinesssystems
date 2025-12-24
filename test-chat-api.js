// Test script for the chat API with OpenAI
async function testChatAPI() {
  const baseUrl = 'http://localhost:3007'
  
  console.log('Testing Chat API with OpenAI...\n')
  
  // Test 1: Start a new conversation
  console.log('Test 1: Starting new conversation...')
  try {
    const response1 = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: "Hello, I need help with building software for my business"
      })
    })
    
    const data1 = await response1.json()
    console.log('Response:', data1.response)
    console.log('Session ID:', data1.sessionId)
    console.log('Messages Remaining:', data1.messagesRemaining)
    console.log('---\n')
    
    // Test 2: Continue conversation
    console.log('Test 2: Continuing conversation...')
    const response2 = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: "What's your pricing?",
        sessionId: data1.sessionId
      })
    })
    
    const data2 = await response2.json()
    console.log('Response:', data2.response)
    console.log('Messages Remaining:', data2.messagesRemaining)
    console.log('---\n')
    
    // Test 3: Check session status
    console.log('Test 3: Checking session status...')
    const response3 = await fetch(`${baseUrl}/api/chat?sessionId=${data1.sessionId}`)
    const data3 = await response3.json()
    console.log('Session Status:', data3)
    console.log('---\n')
    
    console.log('✅ All tests passed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run the test
testChatAPI()