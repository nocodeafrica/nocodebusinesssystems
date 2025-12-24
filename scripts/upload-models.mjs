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

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const MODELS_DIR = path.join(__dirname, '../public/models');
const BUCKET_NAME = 'models';

async function uploadModels() {
  console.log('🚀 Starting Model Migration to Supabase Storage...');

  // 1. Check/Create Bucket
  const { data: buckets, error: listError } =
    await supabase.storage.listBuckets();

  if (listError) {
    console.error('❌ Error listing buckets:', listError.message);
    process.exit(1);
  }

  const bucketExists = buckets.find((b) => b.name === BUCKET_NAME);

  if (!bucketExists) {
    console.log(`📦 Creating bucket: ${BUCKET_NAME}...`);
    const { error: createError } = await supabase.storage.createBucket(
      BUCKET_NAME,
      {
        public: true,
      }
    );
    if (createError) {
      console.error('❌ Error creating bucket:', createError.message);
      process.exit(1);
    }
  } else {
    console.log(`✅ Bucket '${BUCKET_NAME}' already exists.`);
  }

  // 2. Read Files
  if (!fs.existsSync(MODELS_DIR)) {
    console.error(`❌ Models directory not found: ${MODELS_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(MODELS_DIR)
    .filter((file) => file.endsWith('.glb'));
  console.log(`found ${files.length} .glb files`);

  const uploadedUrls = {};

  // 3. Upload Each File
  for (const file of files) {
    const filePath = path.join(MODELS_DIR, file);
    const fileBuffer = fs.readFileSync(filePath);
    const contentType = 'model/gltf-binary'; // Standard for GLB

    console.log(
      `\n⬆️ Uploading ${file} (${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB)...`
    );

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(file, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error(`❌ Failed to upload ${file}:`, error.message);
    } else {
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(file);

      const publicUrl = publicUrlData.publicUrl;
      console.log(`✅ Uploaded! URL: ${publicUrl}`);
      uploadedUrls[file] = publicUrl;
    }
  }

  console.log('\n✨ Migration Complete!');
  console.log('---------------------------------------------------');
  console.log('Update your lib/models.ts with these URLs:');
  console.log(JSON.stringify(uploadedUrls, null, 2));
}

uploadModels().catch((err) => console.error(err));
