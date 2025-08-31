// utils/documentHelpers.js
import { nanoid } from 'nanoid'

// Generate a unique transaction ID for each document operation
export function generateTransactionId() {
  return `transaction_${nanoid()}`
}

// Helper to safely patch a document with retry logic and unique transaction IDs
export async function safelyPatchDocument(client, documentId, patches, options = {}) {
  // Create a unique transaction ID for this operation
  const transactionId = generateTransactionId()
  
  try {
    return await client
      .patch(documentId)
      .setIfMissing({ ...options.setIfMissing })
      .set({ ...options.set })
      .unset(options.unset || [])
      .commit({ transactionId })
  } catch (error) {
    if (error.message && error.message.includes('already exists')) {
      // If there's a transaction ID conflict, generate a new one and retry
      console.warn('Transaction ID conflict detected, retrying with a new ID')
      return safelyPatchDocument(client, documentId, patches, options)
    }
    throw error
  }
}

// Helper to safely create a document with a unique ID
export async function safelyCreateDocument(client, document) {
  const doc = {
    _type: document._type,
    ...document,
    _id: document._id || `${document._type}_${nanoid()}`,
  }
  
  try {
    return await client.create(doc, { 
      transactionId: generateTransactionId() 
    })
  } catch (error) {
    if (error.message && error.message.includes('already exists')) {
      // If document exists, generate a new ID and retry
      delete doc._id
      doc._id = `${document._type}_${nanoid()}`
      return safelyCreateDocument(client, doc)
    }
    throw error
  }
}