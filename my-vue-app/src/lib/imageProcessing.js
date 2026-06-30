// Eigen client-side beeldverwerking: verkleint foto's in de browser naar .webp.
// Geen externe dienst, geen credits. Maakt een 'full' (max 2000px) en een lichte
// 'thumb' (max 800px) versie. Beide als base64 om naar de upload-functie te sturen.

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

function resizeToBlob(img, max, quality) {
  const scale = Math.min(1, max / Math.max(img.width, img.height))
  const w = Math.round(img.width * scale)
  const h = Math.round(img.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d').drawImage(img, 0, 0, w, h)
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality))
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// Zet oude jsDelivr-URL's om naar raw GitHub. jsDelivr serveert sommige (nieuwe) repos
// niet -> 503; raw werkt direct en is per commit-SHA permanent. Veilig op alle URL's.
export const cdnUrl = (u) =>
  typeof u === 'string'
    ? u.replace(/https:\/\/cdn\.jsdelivr\.net\/gh\/([^@]+)@/, 'https://raw.githubusercontent.com/$1/')
    : u

export async function processImage(file, { maxFull = 2000, maxThumb = 800, quality = 0.82 } = {}) {
  const img = await loadImage(file)
  const [full, thumb] = await Promise.all([
    resizeToBlob(img, maxFull, quality),
    resizeToBlob(img, maxThumb, quality),
  ])
  URL.revokeObjectURL(img.src)
  return {
    fullB64: await blobToBase64(full),
    thumbB64: await blobToBase64(thumb),
  }
}
