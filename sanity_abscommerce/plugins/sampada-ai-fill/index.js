/**
 * Global Studio AI fill (no duplicate fields):
 *
 * - `field` wrapper on image `alt` fields → injects Generate button between Alt & Caption
 * - `input` wrapper on selected text fields → Generate with AI
 *
 * Does NOT replace the whole image input (that caused duplicate alt/caption).
 */
import {definePlugin} from 'sanity'
import {createElement} from 'react'
import {AiAltFieldWithGenerate} from '../../components/ai/AiImageMetaInput.jsx'
import {AiTextFieldInput} from '../../components/ai/AiTextFieldInput.jsx'

function lastSeg(path) {
  if (!Array.isArray(path) || path.length === 0) return null
  return path[path.length - 1]
}

function isImageAltField(props) {
  // String field named "alt" nested under an image (path ends with 'alt', length >= 2)
  const seg = lastSeg(props.path)
  if (seg !== 'alt') return false
  if (!Array.isArray(props.path) || props.path.length < 2) return false
  // schema type is the string field itself
  const t = props.schemaType
  if (!t) return false
  if (t.jsonType && t.jsonType !== 'string') return false
  return true
}

function wantsAiText(schemaType) {
  if (!schemaType) return false
  if (schemaType.options?.aiFill === true) return true
  const n = schemaType.name
  const auto = new Set([
    'title',
    'excerpt',
    'specialty',
    'metaDescription',
    'seoTitle',
    'seoDescription',
    'department',
    'location',
  ])
  const json = schemaType.jsonType
  if (json !== 'string' && schemaType.type !== 'text' && !schemaType.rows) {
    return false
  }
  // Don't wrap the image alt string itself (handled by field wrapper)
  if (n === 'alt' || n === 'caption') return false
  return auto.has(n)
}

export const sampadaAiFill = definePlugin({
  name: 'sampada-ai-fill',
  form: {
    components: {
      // Inject button after Alt field only (Caption remains the next natural field)
      field: (props) => {
        try {
          if (isImageAltField(props)) {
            return createElement(AiAltFieldWithGenerate, props)
          }
        } catch (e) {
          console.error('[sampada-ai-fill] field wrapper error', e)
        }
        return props.renderDefault(props)
      },
      // Text field AI generate
      input: (props) => {
        try {
          if (wantsAiText(props.schemaType)) {
            return createElement(AiTextFieldInput, props)
          }
        } catch (e) {
          console.error('[sampada-ai-fill] input wrapper error', e)
        }
        return props.renderDefault(props)
      },
    },
  },
})
