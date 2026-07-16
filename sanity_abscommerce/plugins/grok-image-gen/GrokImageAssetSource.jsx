import {useCallback, useRef, useState} from 'react'
import {ImageIcon, SparklesIcon, TrashIcon, UploadIcon} from '@sanity/icons'
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Grid,
  Label,
  Select,
  Spinner,
  Stack,
  Text,
  TextArea,
  ThemeProvider,
} from '@sanity/ui'

const ASPECT_RATIOS = [
  {value: '1:1', label: 'Square (1:1)'},
  {value: '16:9', label: 'Landscape (16:9)'},
  {value: '4:3', label: 'Standard (4:3)'},
  {value: '3:2', label: 'Classic (3:2)'},
]

/** Grok accepts image refs as data URIs or public https URLs — max 3 */
const MAX_REFS = 3
const ACCEPT =
  'image/png,image/jpeg,image/jpg,image/webp,image/gif,image/bmp,image/tiff,.png,.jpg,.jpeg,.webp,.gif,.bmp,.tif,.tiff'

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`))
    reader.readAsDataURL(file)
  })
}

/**
 * Sanity asset source UI — Grok generate + optional reference images.
 */
export function GrokImageAssetSource({onClose, onSelect, apiEndpoint}) {
  const fileInputRef = useRef(null)
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('4:3')
  const [numberOfImages, setNumberOfImages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState([])
  const [error, setError] = useState(null)
  /** @type {{ name: string, dataUrl: string }[]} */
  const [references, setReferences] = useState([])

  const handleSelectImage = useCallback(
    (base64, usedPrompt) => {
      if (!onSelect) return
      const value = base64.startsWith('data:')
        ? base64
        : `data:image/png;base64,${base64}`
      onSelect([
        {
          kind: 'base64',
          value,
          assetDocumentProps: {
            _type: 'sanity.imageAsset',
            title: (usedPrompt || 'Grok generated image').slice(0, 255),
            description: usedPrompt || '',
            creditLine: 'Generated with Grok (xAI) via Sampada Studio',
          },
        },
      ])
    },
    [onSelect]
  )

  const handleFiles = useCallback(async (fileList) => {
    const files = Array.from(fileList || []).filter((f) =>
      f.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|bmp|tiff?)$/i.test(f.name)
    )
    if (!files.length) {
      setError('Please upload image files (PNG, JPEG, WebP, GIF, BMP, TIFF)')
      return
    }
    setError(null)
    try {
      const remaining = MAX_REFS - references.length
      if (remaining <= 0) {
        setError(`Maximum ${MAX_REFS} reference images (Grok limit)`)
        return
      }
      const toRead = files.slice(0, remaining)
      const loaded = await Promise.all(
        toRead.map(async (file) => ({
          name: file.name,
          dataUrl: await readFileAsDataUrl(file),
        }))
      )
      setReferences((prev) => [...prev, ...loaded].slice(0, MAX_REFS))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read files')
    }
  }, [references.length])

  const removeReference = useCallback((index) => {
    setReferences((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleGenerate = useCallback(async () => {
    const trimmed = prompt.trim()
    if (!trimmed) {
      setError('Please enter a prompt')
      return
    }
    setIsLoading(true)
    setError(null)
    setImages([])

    try {
      const payload = {
        prompt: trimmed,
        aspectRatio,
        numberOfImages,
      }
      if (references.length) {
        payload.referenceImages = references.map((r) => r.dataUrl)
      }

      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      })

      // Network/CORS/404 often surfaces as failed fetch — surface status when we have a body
      let data = {}
      try {
        data = await res.json()
      } catch {
        /* empty */
      }

      if (!res.ok) {
        throw new Error(
          data.error ||
            data.message ||
            `API error ${res.status}${res.status === 404 ? ' — endpoint not deployed' : ''}`
        )
      }
      if (!data?.images?.length) {
        throw new Error('No images returned from API')
      }
      setImages(data.images)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to generate image'
      // Browser TypeError: Failed to fetch
      if (/failed to fetch/i.test(msg)) {
        setError(
          'Failed to reach image API. Ensure the site is deployed with /api/generate-image and CORS is open (or run Next.js locally).'
        )
      } else {
        setError(msg)
      }
    } finally {
      setIsLoading(false)
    }
  }, [prompt, aspectRatio, numberOfImages, apiEndpoint, references])

  return (
    <ThemeProvider>
      <Dialog
        id="sampada-grok-image-source"
        header="Generate Image (Grok)"
        onClose={onClose}
        open
        width={2}
      >
        <Box padding={4}>
          <Stack space={4}>
            <Stack space={2}>
              <Label size={1}>Prompt</Label>
              <TextArea
                fontSize={2}
                padding={3}
                rows={3}
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.currentTarget.value)
                  setError(null)
                }}
                placeholder="Describe the product image you want…"
                disabled={isLoading}
              />
            </Stack>

            <Stack space={2}>
              <Label size={1}>Reference images (optional, max {MAX_REFS})</Label>
              <Text size={1} muted>
                PNG, JPEG, WebP, GIF, BMP, TIFF — used by Grok as style/product references
                (image edit).
              </Text>
              <Flex gap={2} wrap="wrap" align="center">
                <Button
                  icon={UploadIcon}
                  text="Upload reference"
                  mode="ghost"
                  fontSize={1}
                  padding={3}
                  disabled={isLoading || references.length >= MAX_REFS}
                  onClick={() => fileInputRef.current?.click()}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPT}
                  multiple
                  style={{display: 'none'}}
                  onChange={(e) => {
                    handleFiles(e.target.files)
                    e.target.value = ''
                  }}
                />
                <Text size={1} muted>
                  {references.length}/{MAX_REFS} attached
                </Text>
              </Flex>
              {references.length > 0 && (
                <Grid columns={[3, 4]} gap={2}>
                  {references.map((ref, index) => (
                    <Card key={`${ref.name}-${index}`} padding={1} radius={2} shadow={1} border>
                      <Stack space={1}>
                        <img
                          src={ref.dataUrl}
                          alt={ref.name}
                          style={{
                            width: '100%',
                            height: 72,
                            objectFit: 'cover',
                            borderRadius: 4,
                            display: 'block',
                          }}
                        />
                        <Flex justify="space-between" align="center" gap={1}>
                          <Text size={0} muted style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>
                            {ref.name}
                          </Text>
                          <Button
                            icon={TrashIcon}
                            mode="bleed"
                            tone="critical"
                            padding={2}
                            fontSize={0}
                            onClick={() => removeReference(index)}
                            disabled={isLoading}
                            aria-label={`Remove ${ref.name}`}
                          />
                        </Flex>
                      </Stack>
                    </Card>
                  ))}
                </Grid>
              )}
            </Stack>

            <Flex gap={3} wrap="wrap">
              <Stack space={2} style={{minWidth: 160, flex: 1}}>
                <Label size={1}>Aspect ratio</Label>
                <Select
                  fontSize={2}
                  padding={3}
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.currentTarget.value)}
                  disabled={isLoading}
                >
                  {ASPECT_RATIOS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </Stack>
              <Stack space={2} style={{minWidth: 120}}>
                <Label size={1}>Count</Label>
                <Select
                  fontSize={2}
                  padding={3}
                  value={numberOfImages}
                  onChange={(e) => setNumberOfImages(Number(e.currentTarget.value))}
                  disabled={isLoading}
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </Select>
              </Stack>
            </Flex>

            <Button
              icon={references.length ? ImageIcon : SparklesIcon}
              text={
                isLoading
                  ? 'Generating…'
                  : references.length
                    ? 'Generate from references'
                    : 'Generate'
              }
              tone="primary"
              fontSize={2}
              padding={3}
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
            />

            {error && (
              <Card padding={3} radius={2} tone="critical" border>
                <Text size={1}>{error}</Text>
              </Card>
            )}

            {isLoading && (
              <Flex align="center" justify="center" gap={3} padding={5}>
                <Spinner muted />
                <Text size={1} muted>
                  {references.length
                    ? 'Editing with Grok using your references…'
                    : 'Generating with Grok…'}
                </Text>
              </Flex>
            )}

            {!isLoading && images.length > 0 && (
              <Stack space={2}>
                <Text size={1} muted>
                  Click an image to use it
                </Text>
                <Grid columns={[1, 2]} gap={3}>
                  {images.map((img, index) => {
                    const src = img.startsWith('data:')
                      ? img
                      : img.startsWith('http')
                        ? img
                        : `data:image/png;base64,${img}`
                    return (
                      <Card
                        key={`${index}-${String(img).slice(0, 24)}`}
                        padding={1}
                        radius={2}
                        shadow={1}
                        style={{cursor: 'pointer', overflow: 'hidden'}}
                        onClick={() => handleSelectImage(img, prompt)}
                      >
                        <img
                          src={src}
                          alt={`Generated ${index + 1}`}
                          style={{width: '100%', display: 'block', borderRadius: 4}}
                        />
                      </Card>
                    )
                  })}
                </Grid>
              </Stack>
            )}
          </Stack>
        </Box>
      </Dialog>
    </ThemeProvider>
  )
}
