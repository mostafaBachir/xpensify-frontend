// lib/image.js
import imageCompression from "browser-image-compression"

// ⬇️ Compression côté client
export async function compressImage(file) {
  const options = {
    maxWidthOrHeight: 1500,
    maxSizeMB: 1,
    useWebWorker: true,
  }

  try {
    return await imageCompression(file, options)
  } catch (err) {
    console.error("Erreur compression :", err)
    return file // fallback
  }
}

// ⬇️ Génération du hash SHA-256
export async function hashFile(file) {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}
