import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load ecosystem variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    '❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local'
  );
  process.exit(1);
}

// Custom fetch to increase timeout
const customFetch = (url, options) => {
  return fetch(url, {
    ...options,
    // Node.js specific: extend timeout to 30 minutes
    // @ts-ignore
    timeout: 30 * 60 * 1000,
    duplex: 'half', // required for node fetch with body
  });
};

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  global: {
    fetch: customFetch,
  },
});

const MODELS_DIR = path.join(__dirname, '../public/models');
const BUCKET_NAME = 'models';
const FILE_NAME = 'volvo_s90_recharge_free.glb';

async function uploadVolvo() {
  console.log(`🚀 Retrying upload for ${FILE_NAME}...`);

  const filePath = path.join(MODELS_DIR, FILE_NAME);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  const fileBuffer = fs.readFileSync(filePath);
  const contentType = 'model/gltf-binary';

  console.log(
    `\n⬆️ Uploading ${FILE_NAME} (${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB)...`
  );
  console.log('This may take a while...');

  // Using a raw upload with duplex 'half' might be ensuring node fetch works better for large streams
  // but supabase-js wraps this. We'll try the standard way again.

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(FILE_NAME, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error(`❌ Failed to upload ${FILE_NAME}:`, error.message);
    console.error(error);
  } else {
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(FILE_NAME);

    console.log(`✅ Uploaded! URL: ${publicUrlData.publicUrl}`);
  }
}

uploadVolvo().catch((err) => console.error(err));
