/**
 * Lob.com Address Validation API Endpoint
 * 
 * POST /api/lob/validate-address
 */

import { validateAddressAuto } from '@/lib/lob'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }

  try {
    const { line1, line2, city, state, zip, country } = req.body

    if (!line1 || !city || !state || !zip) {
      return res.status(400).json({
        error: 'line1, city, state, and zip are required'
      })
    }

    const result = await validateAddressAuto({
      line1,
      line2: line2 || '',
      city,
      state,
      zip,
      country: country || 'US'
    })

    return res.status(200).json(result)
  } catch (error) {
    console.error('Lob validation error:', error)
    return res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}
