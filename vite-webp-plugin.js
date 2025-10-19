/**
 * Custom Vite Plugin for WebP Conversion
 * Simple and reliable WebP conversion plugin
 */

import sharp from 'sharp';
import { readdir, mkdir, copyFile } from 'fs/promises';
import { join, extname, dirname, basename, resolve } from 'path';

// Function for recursive file search
async function findImageFiles(dir, extensions = ['.png', '.jpg', '.jpeg']) {
  const files = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subFiles = await findImageFiles(fullPath, extensions);
        files.push(...subFiles);
      } else if (extensions.includes(extname(entry.name).toLowerCase())) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.warn(`Cannot read directory ${dir}:`, error.message);
  }
  
  return files;
}

// Function for WebP conversion
async function convertToWebP(inputPath, outputPath, quality = 80) {
  try {
    await sharp(inputPath)
      .webp({ quality })
      .toFile(outputPath);
    
    console.log(`✅ Converted: ${basename(inputPath)} → ${basename(outputPath)}`);
    return true;
  } catch (error) {
    console.warn(`❌ Failed to convert ${basename(inputPath)}:`, error.message);
    return false;
  }
}

// Plugin for Vite
export function webpPlugin(options = {}) {
  const {
    quality = 80,
    generateWebp = true
  } = options;

  return {
    name: 'webp-converter',
    async buildStart() {
      if (!generateWebp) return;

      console.log('🔄 Starting WebP conversion...');
      
      const publicDir = resolve(process.cwd(), 'public');
      const distDir = resolve(process.cwd(), 'dist');
      
      try {
        // Find all images in public/images
        const imagesDir = join(publicDir, 'images');
        console.log(`🔍 Looking for images in: ${imagesDir}`);
        
        const imageFiles = await findImageFiles(imagesDir);
        
        if (imageFiles.length === 0) {
          console.log('📁 No images found in public/images/');
          return;
        }
        
        console.log(`📸 Found ${imageFiles.length} images to convert:`);
        imageFiles.forEach(file => console.log(`  - ${file}`));
        
        // Convert each image
        for (const imagePath of imageFiles) {
          const relativePath = imagePath.replace(publicDir + '\\', '').replace(publicDir + '/', '');
          const webpPath = join(distDir, relativePath).replace(/\.(png|jpeg|jpg)$/i, '.webp');
          
          console.log(`🔄 Converting: ${imagePath} → ${webpPath}`);
          
          // Create directory if not exists
          await mkdir(dirname(webpPath), { recursive: true });
          
          // Convert to WebP
          await convertToWebP(imagePath, webpPath, quality);
        }
        
        console.log('✅ WebP conversion completed!');
        
      } catch (error) {
        console.error('❌ WebP conversion failed:', error.message);
      }
    },
    
    async generateBundle() {
      if (!generateWebp) return;

      // Also copy original images to dist
      const publicDir = resolve(process.cwd(), 'public');
      const distDir = resolve(process.cwd(), 'dist');
      
      try {
        const imageFiles = await findImageFiles(join(publicDir, 'images'));
        
        for (const imagePath of imageFiles) {
          const relativePath = imagePath.replace(publicDir + '\\', '').replace(publicDir + '/', '');
          const distPath = join(distDir, relativePath);
          
          // Create directory if not exists
          await mkdir(dirname(distPath), { recursive: true });
          
          // Copy original file
          await copyFile(imagePath, distPath);
        }
        
        console.log('📁 Original images copied to dist/');
        
      } catch (error) {
        console.error('❌ Failed to copy original images:', error.message);
      }
    }
  };
}

export default webpPlugin;
