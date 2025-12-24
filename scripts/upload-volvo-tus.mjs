import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import * as tus from 'tus-js-client';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = 'models';
const FILE_NAME = 'volvo_s90_recharge_free.glb';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Env Vars');
  process.exit(1);
}

const MODELS_DIR = path.join(__dirname, '../public/models');
const filePath = path.join(MODELS_DIR, FILE_NAME);

if (!fs.existsSync(filePath)) {
  console.error(`❌ File not found: ${filePath}`);
  process.exit(1);
}

async function uploadTus() {
  console.log(`🚀 Starting Resumable Upload (TUS) for ${FILE_NAME}...`);

  // File size
  const stats = fs.statSync(filePath);
  const fileSize = stats.size;

  // Create read stream
  const fileStream = fs.createReadStream(filePath);

  // TUS Endpoint for Supabase Storage
  // Format: [Project URL]/storage/v1/upload/resumable
  const endpoint = `${SUPABASE_URL}/storage/v1/upload/resumable`;

  const upload = new tus.Upload(fileStream, {
    endpoint,
    retryDelays: [0, 1000, 3000, 5000],
    headers: {
      authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'x-upsert': 'true', // upsert
    },
    uploadDataDuringCreation: true,
    metadata: {
      bucketName: BUCKET_NAME,
      objectName: FILE_NAME,
      contentType: 'model/gltf-binary',
    },
    chunkSize: 6 * 1024 * 1024, // 6MB chunks
    onError: function (error) {
      console.error('❌ Upload Failed:', error);
    },
    onProgress: function (bytesUploaded, bytesTotal) {
      const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
      console.log(
        `⏳ Uploading... ${percentage}% (${(bytesUploaded / 1024 / 1024).toFixed(2)} MB / ${(bytesTotal / 1024 / 1024).toFixed(2)} MB)`
      );
    },
    onSuccess: function () {
      console.log('✅ Upload Finished!');
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${FILE_NAME}`;
      console.log(`🔗 Public URL: ${publicUrl}`);
    },
  });

  // Start
  upload.start();
}

uploadTus().catch((err) => console.error(err));
