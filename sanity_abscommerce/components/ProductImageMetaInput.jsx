/**
 * Product image input — generates alt + caption into the image value.
 *
 * Critical: uses image-level props.onChange(set({...value, alt, caption}))
 * which is the same pattern as AIDescriptionInput and reliably updates the form.
 */
import {useCallback, useState} from 'react'
import {set, useClient, useFormValue} from 'sanity'
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

export function ProductImageMetaInput(props) {
  const {value, onChange, renderDefault} = props
  const client = useClient({apiVersion: '2024-05-18'})

  const productName = useFormValue(['name'])
  const categoryRef = useFormValue(['category'])
  const details = useFormValue(['details'])
  const price = useFormValue(['price'])
  const specialty = useFormValue(['specialty'])

  const hasAsset = Boolean(value?.asset?._ref)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [okMsg, setOkMsg] = useState(null)

  const applyAltCaption = useCallback(
    (alt, caption) => {
      // Merge into current image value — preserves asset, hotspot, crop, _key
      const next = {
        ...(value && typeof value === 'object' ? value : {}),
        _type: (value && value._type) || 'image',
        alt: String(alt || '').trim(),
        caption: String(caption || '').trim(),
      }
      // Same pattern as AIDescriptionInput: onChange(set(newValue))
      onChange(set(next))
    },
    [value, onChange]
  )

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
      if (value?.asset?._ref) {
        try {
          const asset = await client.getDocument(value.asset._ref)
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
      if (!res.ok) throw new Error(data.error || `API error ${res.status}`)
      if (!data.alt && !data.caption) throw new Error('No alt/caption returned')
      alt = String(data.alt || '').trim()
      caption = String(data.caption || '').trim()
      source = data.source || 'xai'
    } catch (err) {
      console.warn('[ProductImageMetaInput] API failed, local fallback', err)
      const fb = localFallback(context)
      alt = fb.alt
      caption = fb.caption
      source = 'local'
      if (!productName && !hasAsset) {
        setError(err instanceof Error ? err.message : 'Generation failed')
        setLoading(false)
        return
      }
    }

    try {
      applyAltCaption(alt, caption)
      setOkMsg(
        source === 'local'
          ? 'Filled from product data — edit anytime.'
          : 'Alt text & caption generated — edit anytime.'
      )
    } catch (writeErr) {
      console.error('[ProductImageMetaInput] onChange failed', writeErr)
      setError(
        writeErr instanceof Error
          ? writeErr.message
          : 'Could not write values into the form'
      )
    } finally {
      setLoading(false)
    }
  }, [
    client,
    categoryRef,
    value,
    productName,
    details,
    specialty,
    price,
    hasAsset,
    applyAltCaption,
  ])

  return (
    <Stack space={4}>
      {/* Full default image UI (preview, upload, alt, caption) */}
      {renderDefault(props)}

      <Card
        padding={3}
        radius={2}
        shadow={1}
        tone="transparent"
        border
        // Sit visually near the text fields
        style={{marginTop: -8}}
      >
        <Stack space={3}>
          <Text size={1} muted>
            Click to fill <strong>Alt Text</strong> and <strong>Caption</strong>{' '}
            above from product data and this image. You can still edit them after.
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
              <Text size={1}>
                {okMsg}
                {(value?.alt || value?.caption) && (
                  <>
                    {' '}
                    Current: alt “{value?.alt || '—'}” / caption “
                    {value?.caption || '—'}”
                  </>
                )}
              </Text>
            </Card>
          )}
        </Stack>
      </Card>
    </Stack>
  )
}

// Alias if anything still imports the old name
export {ProductImageMetaInput as ProductImageAltField}
