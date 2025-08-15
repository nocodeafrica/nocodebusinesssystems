# 3D Models Directory

Place your GLTF/GLB 3D models in this folder.

## Supported Formats
- `.glb` (recommended - single binary file)
- `.gltf` (JSON + separate texture files)

## Where to Get Free Models

### Construction & Architecture Models
1. **Sketchfab** - https://sketchfab.com/tags/building
   - Filter by "Downloadable" for free models
   - Look for CC (Creative Commons) licensed models
   - Download in GLTF format

2. **Specific Model Collections**:
   - BIM Models: https://sketchfab.com/tags/bim
   - Construction: https://sketchfab.com/tags/construction
   - Architecture: https://sketchfab.com/tags/architecture

### How to Use
1. Download a `.glb` or `.gltf` model
2. Place it in this `/public/models/` folder
3. In the component, set the model path to `/models/your-model.glb`

### Example Models to Try
Search for these on Sketchfab:
- "Construction site" (free downloadable)
- "Office building BIM"
- "Warehouse 3D model"
- "House construction"

### File Size Considerations
- Keep models under 10MB for fast loading
- Use GLB format for better compression
- Consider using Draco compression for large models

### License Information
Always check the license before using models:
- CC0 - No rights reserved (best for commercial use)
- CC BY - Attribution required
- CC BY-SA - Attribution + ShareAlike
- CC BY-NC - Attribution + Non-Commercial only