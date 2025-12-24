// Supabase-hosted 3D models configuration

export interface Model3D {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  size: string;
}

export const SUPABASE_MODELS: Model3D[] = [
  {
    id: 'volvo_s90',
    name: 'Volvo S90 Recharge',
    url: 'https://adurrlchwyiyygodcrwh.supabase.co/storage/v1/object/public/models/volvo_s90_recharge_free.glb',
    description:
      'High-fidelity 4K model of the Volvo S90 Recharge luxury sedan.',
    category: 'Automotive',
    size: '368 MB',
  },
  {
    id: 'ferrari_laferrari',
    name: 'Ferrari LaFerrari',
    url: 'https://adurrlchwyiyygodcrwh.supabase.co/storage/v1/object/public/models/ferrari_laferrari__element_6.glb',
    description: 'Bespoke custom grand tourer with high-performance specs.',
    category: 'Automotive',
    size: '185 MB',
  },
  {
    id: 'military_vehicle',
    name: 'Military Vehicle',
    url: 'https://adurrlchwyiyygodcrwh.supabase.co/storage/v1/object/public/models/military_vehicle.glb',
    description: 'Heavy transport vehicle with unique capabilities.',
    category: 'Military',
    size: '210 MB',
  },
  {
    id: 'suspension_bridge',
    name: 'Suspension Bridge',
    url: 'https://adurrlchwyiyygodcrwh.supabase.co/storage/v1/object/public/models/suspension_bridge.glb',
    description: 'Detailed civil engineering model of a suspension bridge.',
    category: 'Infrastructure',
    size: '120 MB',
  },
  {
    id: 'futuristic_city',
    name: 'Futuristic City',
    url: 'https://adurrlchwyiyygodcrwh.supabase.co/storage/v1/object/public/models/futuristic_city.glb',
    description: 'Large scale futuristic city planning model.',
    category: 'Architecture',
    size: '450 MB',
  },
];

// Helper functions
export const getModelByCategory = (category: string): Model3D[] => {
  return SUPABASE_MODELS.filter((model) => model.category === category);
};

export const getModelById = (id: string): Model3D | undefined => {
  return SUPABASE_MODELS.find((model) => model.id === id);
};

export const getAllModelUrls = (): string[] => {
  return SUPABASE_MODELS.map((model) => model.url);
};

export const getRandomModel = (): Model3D => {
  const randomIndex = Math.floor(Math.random() * SUPABASE_MODELS.length);
  return SUPABASE_MODELS[randomIndex];
};

// Default model for fallback
export const DEFAULT_MODEL = SUPABASE_MODELS[0];
