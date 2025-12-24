// Script to upload the remaining large 3D models to Supabase Storage
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize Supabase client with secret key for admin access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY

if (!supabaseUrl || !supabaseSecretKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Remaining models to upload (the large ones that failed before)
const remainingModels = [
  'neighbourhood_city_modular_lowpoly.glb',
  'hyundai_hl975a_wheel_loader.glb'
]

async function uploadRemainingModels() {
  console.log('🚀 Uploading remaining large models to Supabase Storage...\n')
  
  const bucketName = 'models'
  
  // Upload each remaining model
  for (const modelFile of remainingModels) {
    const filePath = path.join(__dirname, '..', 'public', 'models', modelFile)
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${modelFile}`)
      continue
    }
    
    console.log(`📤 Uploading ${modelFile}...`)
    
    try {
      const fileBuffer = fs.readFileSync(filePath)
      const fileSize = (fileBuffer.length / 1024 / 1024).toFixed(2)
      console.log(`   Size: ${fileSize} MB`)
      
      // Check if file already exists
      const { data: existingFile } = await supabase.storage
        .from(bucketName)
        .list('', {
          search: modelFile
        })
      
      if (existingFile && existingFile.length > 0) {
        console.log(`   ⚠️  File already exists. Updating...`)
        // Remove existing file first
        await supabase.storage
          .from(bucketName)
          .remove([modelFile])
      }
      
      // Upload the file with increased size limit support
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(modelFile, fileBuffer, {
          contentType: 'model/gltf-binary',
          cacheControl: '3600',
          upsert: true
        })
      
      if (error) {
        console.error(`   ❌ Error uploading ${modelFile}:`, error.message)
      } else {
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(modelFile)
        
        console.log(`   ✅ Uploaded successfully!`)
        console.log(`   📍 Public URL: ${publicUrl}\n`)
      }
    } catch (err) {
      console.error(`   ❌ Error processing ${modelFile}:`, err.message)
    }
  }
  
  console.log('\n🎉 Remaining model upload process completed!')
  
  // List all files in the bucket to show final state
  console.log('\n📋 All files in bucket:')
  const { data: files, error: listError } = await supabase.storage
    .from(bucketName)
    .list()
  
  if (listError) {
    console.error('Error listing files:', listError)
  } else if (files) {
    files.forEach(file => {
      const size = (file.metadata?.size / 1024 / 1024).toFixed(2) || '0'
      console.log(`   - ${file.name} (${size} MB)`)
    })
    console.log(`\nTotal files: ${files.length}`)
  }
}

// Run the upload
uploadRemainingModels().catch(console.error)