'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Dynamic imports for code splitting
const DesktopVersion = dynamic(() => import('../ApplicantTracking'), {
  ssr: false,
  loading: () => <LoadingState />
})

const MobileVersion = dynamic(() => import('../ApplicantTrackingMobile'), {
  ssr: false,
  loading: () => <LoadingState />
})

const LoadingState = () => (
  <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded-2xl">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p className="text-sm text-gray-600">Loading Applicant Tracking...</p>
    </div>
  </div>
)

const ApplicantTrackingWrapper = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768) // Tailwind's md breakpoint
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  if (!isClient) {
    return <LoadingState />
  }

  return isMobile ? <MobileVersion /> : <DesktopVersion />
}

export default ApplicantTrackingWrapper