// lib/getLocalStories.js
import fs from 'fs'
import path from 'path'

const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp)$/i

const lookNames = [
  {
    title: 'Kavya — Casual Chic',
    tag: "Women's Collection",
    description: 'Effortless days call for effortless style. Kavya pairs our signature tee with denim for that perfect park-ready look.',
    styleTip: 'Pair with high-waist wide-leg jeans and white sneakers. Add a denim jacket for Bangalore evenings.',
    behindTheScenes: 'Cubbon Park, Bengaluru — golden hour, April 2026.',
  },
  {
    title: 'Kavya — Café Vibes',
    tag: "Women's Collection",
    description: 'Sunlit mornings and good coffee. Our Wild & Free crop tee — for the woman who owns every room she walks into.',
    styleTip: 'Style with a floral mini skirt and block heels. Perfect for brunch or a gallery visit.',
    behindTheScenes: 'Sunlit café, Indiranagar — morning light, candid energy.',
  },
  {
    title: 'Kavya — Garden Walk',
    tag: 'Sampada Originals',
    description: 'Among blooms and golden light. The Kindness Is Free tee — because what you wear should reflect what you believe.',
    styleTip: 'Tuck into straight-fit jeans, add a denim jacket over shoulders. Accessorize with pearl hoops.',
    behindTheScenes: 'Lalbagh Botanical Garden, Bengaluru — natural light, spring bloom.',
  },
  {
    title: 'Kavya — Studio Edit',
    tag: 'Winter Drop 2026',
    description: 'Bold. Structured. Unapologetic. Kavya brings the energy in our Winter Drop — made for women who lead.',
    styleTip: 'Wear the blazer open over a graphic tee for street style, or buttoned for boardroom power dressing.',
    behindTheScenes: 'Studio session — white cyc wall, professional lighting, April 2026.',
  },
  {
    title: 'Kavya — Evening Luxe',
    tag: 'Festive Collection',
    description: "When the evening calls for gold. Sampada's festive range — heritage craftsmanship meets modern elegance.",
    styleTip: 'Keep accessories minimal — gold jhumkas and a nude clutch complete the look.',
    behindTheScenes: 'Festive evening shoot — warm candlelight, restaurant setting, Bengaluru.',
  },
  {
    title: 'Kavya — Red Carpet',
    tag: 'Premium Collection',
    description: "She doesn't walk into a room — she arrives. Our premium silhouettes for your most unforgettable moments.",
    styleTip: 'A classic red lip and strappy heels. Keep hair sleek or low bun to let the silhouette shine.',
    behindTheScenes: 'Red carpet editorial — dramatic studio lighting, Bengaluru.',
  },
  {
    title: 'Kavya — Beach Days',
    tag: 'Summer Collection',
    description: 'Salt air and Choose Joy. Our summer crop tee for the days you want to feel everything — light, free, and alive.',
    styleTip: 'Knot the tee at the waist or wear loose over swimwear. Add sunglasses and a woven tote.',
    behindTheScenes: 'Beach boardwalk — golden hour, Goa.',
  },
]

export function getLocalModelImages(modelName, tag = 'Sampada Originals') {
  const dir = path.join(process.cwd(), 'public', 'images', modelName)
  if (!fs.existsSync(dir)) return []

  const files = fs.readdirSync(dir)
    .filter(f => IMAGE_EXTENSIONS.test(f))
    .sort()

  return files.map((file, i) => {
    const meta = lookNames[i] || {
      title: `${modelName} — Look ${i + 1}`,
      tag,
      description: 'A new look from Sampada.',
      styleTip: 'Style as you like.',
      behindTheScenes: 'Bengaluru, 2026.',
    }
    return {
      _id: `local-${modelName.toLowerCase()}-${i}`,
      title: meta.title,
      model: modelName,
      source: 'local',
      coverImage: `/images/${modelName}/${file}`,
      tag: meta.tag,
      description: meta.description,
      styleTip: meta.styleTip,
      behindTheScenes: meta.behindTheScenes,
      publishedAt: new Date().toISOString(),
      slug: null,
      index: i,
    }
  })
}

export function getLocalKavyaImages() {
  return getLocalModelImages('Kavya', 'Sampada Originals')
}
