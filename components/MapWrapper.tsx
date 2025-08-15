'use client'

import { useEffect, useState } from 'react'

// This wrapper ensures map components are only loaded on the client
export default function MapWrapper({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 animate-pulse flex items-center justify-center">
        <div className="text-blue-600">Loading map...</div>
      </div>
    )
  }
  
  return <>{children}</>
}