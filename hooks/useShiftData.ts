import { useState } from 'react'
import { Sun, Coffee, Moon } from 'lucide-react'

export const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const shiftTypes = [
  { id: 'morning', name: 'Morning', time: '6:00 AM - 2:00 PM', icon: Sun, color: 'bg-yellow-500' },
  { id: 'afternoon', name: 'Afternoon', time: '2:00 PM - 10:00 PM', icon: Coffee, color: 'bg-orange-500' },
  { id: 'night', name: 'Night', time: '10:00 PM - 6:00 AM', icon: Moon, color: 'bg-indigo-600' },
  { id: 'fullday', name: 'Full Day', time: '9:00 AM - 6:00 PM', icon: Sun, color: 'bg-green-500' }
]

export const weeklySchedule = [
  {
    employee: { id: 1, name: 'Sarah Johnson', role: 'Manager', avatar: 'https://i.pravatar.cc/150?img=1' },
    shifts: {
      Monday: 'morning',
      Tuesday: 'morning',
      Wednesday: 'morning',
      Thursday: 'morning',
      Friday: 'morning',
      Saturday: null,
      Sunday: null
    }
  },
  {
    employee: { id: 2, name: 'Michael Chen', role: 'Cashier', avatar: 'https://i.pravatar.cc/150?img=3' },
    shifts: {
      Monday: 'afternoon',
      Tuesday: 'afternoon',
      Wednesday: 'morning',
      Thursday: 'afternoon',
      Friday: 'afternoon',
      Saturday: 'morning',
      Sunday: null
    }
  },
  {
    employee: { id: 3, name: 'Emily Rodriguez', role: 'Stock Manager', avatar: 'https://i.pravatar.cc/150?img=5' },
    shifts: {
      Monday: 'morning',
      Tuesday: 'morning',
      Wednesday: 'afternoon',
      Thursday: 'morning',
      Friday: 'morning',
      Saturday: 'morning',
      Sunday: null
    }
  },
  {
    employee: { id: 4, name: 'James Wilson', role: 'Security', avatar: 'https://i.pravatar.cc/150?img=8' },
    shifts: {
      Monday: 'night',
      Tuesday: 'night',
      Wednesday: 'night',
      Thursday: 'night',
      Friday: 'night',
      Saturday: null,
      Sunday: null
    }
  },
  {
    employee: { id: 5, name: 'Lisa Thompson', role: 'Supervisor', avatar: 'https://i.pravatar.cc/150?img=9' },
    shifts: {
      Monday: 'afternoon',
      Tuesday: 'afternoon',
      Wednesday: 'afternoon',
      Thursday: 'afternoon',
      Friday: null,
      Saturday: 'afternoon',
      Sunday: 'afternoon'
    }
  },
  {
    employee: { id: 6, name: 'David Kim', role: 'Cashier', avatar: 'https://i.pravatar.cc/150?img=11' },
    shifts: {
      Monday: null,
      Tuesday: 'morning',
      Wednesday: 'morning',
      Thursday: 'morning',
      Friday: 'afternoon',
      Saturday: 'afternoon',
      Sunday: 'morning'
    }
  }
]

export const shiftRequests = [
  { id: 1, employee: 'Michael Chen', type: 'swap', date: 'Wed, Nov 22', from: 'Morning', to: 'Afternoon', status: 'pending' },
  { id: 2, employee: 'Emily Rodriguez', type: 'leave', date: 'Fri, Nov 24', reason: 'Personal', status: 'approved' },
  { id: 3, employee: 'David Kim', type: 'overtime', date: 'Sat, Nov 25', hours: '4', status: 'pending' }
]

export const coverageStats = [
  { shift: 'Morning', required: 8, assigned: 7, coverage: 87.5 },
  { shift: 'Afternoon', required: 10, assigned: 10, coverage: 100 },
  { shift: 'Night', required: 4, assigned: 3, coverage: 75 },
  { shift: 'Weekend', required: 6, assigned: 5, coverage: 83.3 }
]

export const useShiftData = () => {
  const [selectedWeek, setSelectedWeek] = useState('Nov 20 - Nov 26, 2023')
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week')
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null)
  const [selectedDay, setSelectedDay] = useState<string>('Monday')

  const getShiftColor = (shiftId: string | null) => {
    if (!shiftId) return 'bg-gray-100'
    const shift = shiftTypes.find(s => s.id === shiftId)
    return shift ? shift.color : 'bg-gray-100'
  }

  const getShiftInfo = (shiftId: string | null) => {
    if (!shiftId) return { name: 'Off', time: '-' }
    const shift = shiftTypes.find(s => s.id === shiftId)
    return shift || { name: 'Off', time: '-' }
  }

  const getCoverageColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-600 bg-green-100'
    if (percentage >= 80) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getEmployeesForDay = (day: string) => {
    return weeklySchedule
      .filter(schedule => schedule.shifts[day as keyof typeof schedule.shifts])
      .map(schedule => ({
        ...schedule.employee,
        shift: schedule.shifts[day as keyof typeof schedule.shifts]
      }))
  }

  const getShiftCountForDay = (day: string) => {
    return weeklySchedule.filter(s => s.shifts[day as keyof typeof s.shifts]).length
  }

  return {
    selectedWeek,
    setSelectedWeek,
    viewMode,
    setViewMode,
    selectedEmployee,
    setSelectedEmployee,
    selectedDay,
    setSelectedDay,
    getShiftColor,
    getShiftInfo,
    getCoverageColor,
    getEmployeesForDay,
    getShiftCountForDay,
    daysOfWeek,
    shiftTypes,
    weeklySchedule,
    shiftRequests,
    coverageStats
  }
}