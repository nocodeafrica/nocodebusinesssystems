// Supabase-hosted 3D models configuration

export interface Model3D {
  id: string
  name: string
  url: string
  description: string
  category: string
  size: string
}

export const SUPABASE_MODELS: Model3D[] = [
  {
    id: 'aston_martin_db11',
    name: 'Aston Martin DB11',
    url: 'https://sjbvvrjxsbqrgtpgdxwr.supabase.co/storage/v1/object/public/models/aston_martin_db11.glb',
    description: 'High-quality luxury sports car model',
    category: 'Automotive',
    size: '12.91 MB'
  },
  {
    id: 'ba_an72p',
    name: 'BA An-72P Aircraft',
    url: 'https://sjbvvrjxsbqrgtpgdxwr.supabase.co/storage/v1/object/public/models/ba_an-72p.glb',
    description: 'Detailed aircraft model for aviation demonstrations',
    category: 'Aviation',
    size: '10.67 MB'
  },
  {
    id: 'beautiful_city',
    name: 'Beautiful City',
    url: 'https://sjbvvrjxsbqrgtpgdxwr.supabase.co/storage/v1/object/public/models/beautiful_city.glb',
    description: 'A detailed 3D city model showcasing urban planning and architecture',
    category: 'Architecture',
    size: '41.38 MB'
  },
  {
    id: 'hyundai_wheel_loader',
    name: 'Hyundai Wheel Loader',
    url: 'https://sjbvvrjxsbqrgtpgdxwr.supabase.co/storage/v1/object/public/models/hyundai_hl975a_wheel_loader.glb',
    description: 'Heavy machinery loader for construction and industrial demos',
    category: 'Industrial',
    size: '74.33 MB'
  },
  {
    id: 'neighbourhood_city',
    name: 'Neighbourhood City Modular',
    url: 'https://sjbvvrjxsbqrgtpgdxwr.supabase.co/storage/v1/object/public/models/neighbourhood_city_modular_lowpoly.glb',
    description: 'Low-poly modular city components for urban planning',
    category: 'Architecture',
    size: '80.47 MB'
  }
]

// Helper functions
export const getModelByCategory = (category: string): Model3D[] => {
  return SUPABASE_MODELS.filter(model => model.category === category)
}

export const getModelById = (id: string): Model3D | undefined => {
  return SUPABASE_MODELS.find(model => model.id === id)
}

export const getAllModelUrls = (): string[] => {
  return SUPABASE_MODELS.map(model => model.url)
}

export const getRandomModel = (): Model3D => {
  const randomIndex = Math.floor(Math.random() * SUPABASE_MODELS.length)
  return SUPABASE_MODELS[randomIndex]
}

// Default model for fallback
export const DEFAULT_MODEL = SUPABASE_MODELS[1] // Aston Martin (smallest file)