/**
 * Product image input with one-click AI alt text + caption generation.
 * Renders the default Sanity image UI, then a button that fills alt/caption
 * (user can still edit fields manually).
 */
import {useCallback, useState} from 'react'
import {set, useClient, useFormValue} from 'sanity'
import {Box, Button, Card, Flex, Stack, Text, Spinner} from '@sanity/ui'
import {SparklesIcon} from '@sanity/icons'

const META_ENDPOINT =
  process.env.SANITY_STUDIO_IMAGE_META_URL ||
  'https://sampadaoriginals.in/api/ai/generate-image-meta'

export function ProductImageMetaInput(props) {
  const {value, onChange, renderDefault} = props
  const client = useClient({apiVersion: '2024-05-18'})

  const productName = useFormValue(['name'])
  const categoryRef = useFormValue(['category'])
  const details = useFormValue(['details'])
  const price = useFormValue(['price'])
  const specialty = useFormValue(['specialty'])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [okMsg, setOkMsg] = useState(null)

  const hasAsset = Boolean(value?.asset?._ref)

  const generateMeta = useCallback(async () => {
    setLoading(true)
    setError(null)
    setOkMsg(null)

    try {
      let categoryName = ''
      if (categoryRef?._ref) {
        try {
          const cat = await client.getDocument(categoryRef._ref)
          categoryName = cat?.name || cat?.title || ''
        } catch {
          /* ignore */
        }
      }

      let imageUrl = ''
      if (value?.asset?._ref) {
        try {
          const asset = await client.getDocument(value.asset._ref)
          imageUrl = asset?.url || ''
        } catch {
          /* ignore */
        }
      }

      const res = await fetch(META_ENDPOINT, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          productName: productName || '',
          category: categoryName,
          details: [details, specialty].filter(Boolean).join('\n'),
          price,
          imageUrl: imageUrl || undefined,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || `API error ${res.status}`)
      }
      if (!data.alt && !data.caption) {
        throw new Error('No alt/caption returned')
      }

      const patches = []
      if (data.alt) patches.push(set(String(data.alt), ['alt']))
      if (data.caption) patches.push(set(String(data.caption), ['caption']))
      if (patches.length === 1) {
        onChange(patches[0])
      } else if (patches.length > 1) {
        onChange(patches)
      }

      setOkMsg(
        data.source === 'xai'
          ? 'Alt text & caption generated — edit anytime.'
          : 'Alt text & caption filled from product data — edit anytime.'
      )
    } catch (err) {
      console.error('[ProductImageMetaInput]', err)
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }, [
    client,
    categoryRef,
    value?.asset?._ref,
    productName,
    details,
    specialty,
    price,
    onChange,
  ])

  return (
    <Stack space={3}>
      {renderDefault(props)}

      <Card padding={3} radius={2} shadow={1} tone="transparent" border>
        <Stack space={3}>
          <Text size={1} muted>
            Generate accessibility alt text and a short caption from the product
            name, details, and this image. You can edit either field after.
          </Text>
          <Flex gap={2} align="center" wrap="wrap">
            <Button
              icon={loading ? undefined : SparklesIcon}
              text={loading ? 'Generating…' : 'Generate alt & caption'}
              tone="primary"
              mode="default"
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
