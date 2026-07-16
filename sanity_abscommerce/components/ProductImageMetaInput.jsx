/**
 * Field wrapper for product image `alt` — places "Generate alt & caption"
 * BETWEEN the Alt Text field and the Caption field.
 * Also fills Caption via form callbacks. User can edit either field after.
 */
import {useCallback, useState} from 'react'
import {PatchEvent, set, useClient, useFormCallbacks, useFormValue} from 'sanity'
import {Button, Card, Flex, Stack, Text, Spinner} from '@sanity/ui'
import {SparklesIcon} from '@sanity/icons'

const META_ENDPOINT =
  (typeof process !== 'undefined' &&
    process.env?.SANITY_STUDIO_IMAGE_META_URL) ||
  'https://sampadaoriginals.in/api/ai/generate-image-meta'

function localFallback({productName, category, details}) {
  const name = (productName || 'Product').trim()
  const cat = (category || '').trim()
  const alt = (cat
    ? `${name} — ${cat} from Sampada Originals`
    : `${name} product image from Sampada Originals`
  ).slice(0, 125)
  const detailSnippet = String(details || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120)
  const caption = (detailSnippet
    ? `${name}. ${detailSnippet}${detailSnippet.length >= 120 ? '…' : ''}`
    : `${name} — premium piece from Sampada Originals. Wear your legacy.`
  ).slice(0, 200)
  return {alt, caption, source: 'local'}
}

/**
 * Use as components.field on the image.alt field.
 * Renders: [Alt field UI] → [Generate button] → (Caption field follows in schema order)
 */
export function ProductImageAltField(props) {
  const {renderDefault, path} = props
  const {onChange: onFormChange} = useFormCallbacks()
  const client = useClient({apiVersion: '2024-05-18'})

  const productName = useFormValue(['name'])
  const categoryRef = useFormValue(['category'])
  const details = useFormValue(['details'])
  const price = useFormValue(['price'])
  const specialty = useFormValue(['specialty'])

  // Parent image object path (…, 'alt') → drop last segment
  const imagePath = Array.isArray(path) ? path.slice(0, -1) : []
  const imageValue = useFormValue(imagePath)
  const hasAsset = Boolean(imageValue?.asset?._ref)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [okMsg, setOkMsg] = useState(null)

  const generateMeta = useCallback(async () => {
    setLoading(true)
    setError(null)
    setOkMsg(null)

    let categoryName = ''
    let imageUrl = ''

    try {
      if (categoryRef?._ref) {
        try {
          const cat = await client.getDocument(categoryRef._ref)
          categoryName = cat?.name || cat?.title || ''
        } catch {
          /* ignore */
        }
      }
      if (imageValue?.asset?._ref) {
        try {
          const asset = await client.getDocument(imageValue.asset._ref)
          imageUrl = asset?.url || ''
        } catch {
          /* ignore */
        }
      }
    } catch {
      /* ignore */
    }

    const context = {
      productName: productName || '',
      category: categoryName,
      details: [details, specialty].filter(Boolean).join('\n'),
      price,
      imageUrl: imageUrl || undefined,
    }

    let alt = ''
    let caption = ''
    let source = 'local'

    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 45000)

      const res = await fetch(META_ENDPOINT, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(context),
        signal: controller.signal,
      })
      clearTimeout(timer)

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || `API error ${res.status}`)
      }
      if (!data.alt && !data.caption) {
        throw new Error('No alt/caption returned')
      }
      alt = String(data.alt || '').trim()
      caption = String(data.caption || '').trim()
      source = data.source || 'xai'
    } catch (err) {
      console.warn('[ProductImageAltField] API failed, using local fallback', err)
      const fb = localFallback(context)
      alt = fb.alt
      caption = fb.caption
      source = 'local'
      // Don't show hard error if we can still fill fields
      if (!productName && !hasAsset) {
        setError(err instanceof Error ? err.message : 'Generation failed')
        setLoading(false)
        return
      }
    }

    const captionPath = [...imagePath, 'caption']
    const altPath = path

    // Patch both fields on the document form (absolute paths)
    const ops = []
    if (alt) ops.push(set(alt, altPath))
    if (caption) ops.push(set(caption, captionPath))
    if (ops.length) {
      try {
        onFormChange(PatchEvent.from(ops))
      } catch {
        // Fallback: some Studio versions accept raw patch arrays
        onFormChange(ops)
      }
    }

    setOkMsg(
      source === 'local'
        ? 'Filled from product data (you can edit). API was unreachable or timed out.'
        : 'Alt text & caption generated — edit anytime.'
    )
    setLoading(false)
  }, [
    client,
    categoryRef,
    imageValue?.asset?._ref,
    productName,
    details,
    specialty,
    price,
    path,
    imagePath,
    onFormChange,
    hasAsset,
  ])

  return (
    <Stack space={3}>
      {/* Default Alt Text field (title, description, input) */}
      {renderDefault(props)}

      {/* Button sits between Alt and Caption in the schema field order */}
      <Card padding={3} radius={2} shadow={1} tone="transparent" border>
        <Stack space={3}>
          <Text size={1} muted>
            Auto-fill alt text and caption from product name, details, and this
            image. You can edit either field after.
          </Text>
          <Flex gap={2} align="center" wrap="wrap">
            <Button
              icon={loading ? undefined : SparklesIcon}
              text={loading ? 'Generating…' : 'Generate alt & caption'}
              tone="primary"
              fontSize={1}
              padding={3}
              disabled={loading || (!productName && !hasAsset)}
              onClick={generateMeta}
            />
            {loading && <Spinner muted />}
          </Flex>
          {!productName && !hasAsset && (
            <Text size={1} muted>
              Add a product name or image first.
            </Text>
          )}
          {error && (
            <Card padding={2} radius={2} tone="critical" border>
              <Text size={1}>{error}</Text>
            </Card>
          )}
          {okMsg && !error && (
            <Card padding={2} radius={2} tone="positive" border>
              <Text size={1}>{okMsg}</Text>
            </Card>
          )}
        </Stack>
      </Card>
    </Stack>
  )
}

// Keep name used by schema import (backward compatible)
export {ProductImageAltField as ProductImageMetaInput}
