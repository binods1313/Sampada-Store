/**
 * Bulk Edit Tool for Sanity Studio
 * Allows bulk updates to products, categories, and other content types
 *
 * Features:
 * - Select multiple documents
 * - Update common fields (price, discount, status, inventory)
 * - Apply changes to selected documents
 * - Preview changes before committing
 */

import React, { useState, useCallback } from 'react'
import { Box, Button, Card, Flex, Stack, Text, TextInput, Select, Checkbox, Spinner, Code, Label } from '@sanity/ui'
import { useClient } from 'sanity'

// Fields available for bulk editing
const BULK_EDITABLE_FIELDS = {
  product: [
    { name: 'price', title: 'Price', type: 'number' },
    { name: 'discount', title: 'Discount (%)', type: 'number' },
    { name: 'inventory', title: 'Inventory Count', type: 'number' },
    { name: 'status', title: 'Status', type: 'string', options: ['draft', 'active', 'archived'] },
  ],
  category: [
    { name: 'status', title: 'Status', type: 'string', options: ['draft', 'active', 'archived'] },
  ],
  banner: [
    { name: 'status', title: 'Status', type: 'string', options: ['draft', 'active', 'archived'] },
  ],
}

export function BulkEditTool() {
  const client = useClient({ apiVersion: '2024-05-18' })

  const [selectedType, setSelectedType] = useState('product')
  const [selectedDocuments, setSelectedDocuments] = useState([])
  const [allDocuments, setAllDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [updateField, setUpdateField] = useState('')
  const [updateValue, setUpdateValue] = useState('')
  const [updateMode, setUpdateMode] = useState('set')
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [selectAll, setSelectAll] = useState(false)

  // Fetch documents of selected type
  const fetchDocuments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const query = `*[_type == $type] | order(_createdAt desc) { 
        _id, 
        name, 
        title, 
        slug, 
        price, 
        status, 
        inventory,
        discount
      }`
      const docs = await client.fetch(query, { type: selectedType })
      setAllDocuments(docs)
      setSelectedDocuments(docs)
      setSelectAll(true)
    } catch (err) {
      setError(`Failed to fetch documents: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [client, selectedType])

  // Perform bulk update
  const performBulkUpdate = useCallback(async () => {
    if (!updateField || !updateValue || selectedDocuments.length === 0) {
      setError('Please select a field, value, and documents to update')
      return
    }

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const value = updateField === 'status' ? updateValue : parseFloat(updateValue)
      
      // Process documents in batches
      const batchSize = 50
      let updated = 0

      for (let i = 0; i < selectedDocuments.length; i += batchSize) {
        const batch = selectedDocuments.slice(i, i + batchSize)
        const transactions = batch.map(doc => {
          let newValue = value

          // Handle different update modes for numeric fields
          if (updateField !== 'status' && typeof value === 'number') {
            const currentValue = doc[updateField] || 0
            switch (updateMode) {
              case 'increase':
                newValue = currentValue + value
                break
              case 'decrease':
                newValue = currentValue - value
                break
              case 'percentage':
                newValue = currentValue * (1 + value / 100)
                break
              default:
                newValue = value
            }
            // Round to 2 decimal places for prices
            newValue = Math.round(newValue * 100) / 100
          }

          return client.patch(doc._id).set({
            [updateField]: newValue,
            updatedAt: new Date().toISOString()
          })
        })

        await client.transaction(...transactions).commit()
        updated += batch.length
      }

      setResults({
        success: true,
        updated,
        message: `Successfully updated ${updated} ${selectedType}(s)`
      })

      // Refresh document list
      fetchDocuments()
    } catch (err) {
      setError(`Bulk update failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [client, updateField, updateValue, updateMode, selectedDocuments, selectedType, fetchDocuments])

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedDocuments([])
    } else {
      setSelectedDocuments(allDocuments)
    }
    setSelectAll(!selectAll)
  }

  // Toggle individual document
  const toggleDocument = (docId) => {
    if (selectedDocuments.find(d => d._id === docId)) {
      setSelectedDocuments(selectedDocuments.filter(d => d._id !== docId))
    } else {
      const doc = allDocuments.find(d => d._id === docId)
      setSelectedDocuments([...selectedDocuments, doc])
    }
  }

  const availableFields = BULK_EDITABLE_FIELDS[selectedType] || []

  return (
    <div style={{ padding: '16px', maxWidth: '1200px', margin: '0 auto' }}>
      <Stack space={4}>
        {/* Header */}
        <Box>
          <Text weight="bold" size={4}>📝 Bulk Edit Tool</Text>
          <Text muted>Select documents and update multiple fields at once</Text>
        </Box>

        {/* Document Type Selector */}
        <Card padding={4} radius={2} shadow={1}>
          <Stack space={3}>
            <Label>1. Select Content Type</Label>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value)
                setSelectedDocuments([])
                setAllDocuments([])
                setSelectAll(false)
                setUpdateField('')
                setUpdateValue('')
              }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-2)',
                border: '1px solid var(--input-border-color)',
                background: 'var(--input-bg)',
                color: 'var(--input-color)',
                fontSize: '14px',
              }}
            >
              <option value="product">Products</option>
              <option value="category">Categories</option>
              <option value="banner">Banners</option>
            </select>
          </Stack>
        </Card>

        {/* Document Selection */}
        <Card padding={4} radius={2} shadow={1}>
          <Stack space={3}>
            <Flex justify="space-between" align="center">
              <Label>2. Select Documents</Label>
              <Button
                mode="default"
                onClick={fetchDocuments}
                disabled={loading}
                text={loading ? 'Loading...' : 'Refresh List'}
              />
            </Flex>

            {allDocuments.length > 0 && (
              <>
                <Flex align="center">
                  <Checkbox
                    checked={selectAll && allDocuments.length > 0}
                    onChange={toggleSelectAll}
                    id="selectAll"
                  />
                  <Box marginLeft={2}>
                    <Text size={1}>
                      Select All ({selectedDocuments.length} of {allDocuments.length} selected)
                    </Text>
                  </Box>
                </Flex>

                <Box style={{ 
                  maxHeight: '400px', 
                  overflow: 'auto',
                  border: '1px solid var(--card-border-color)',
                  borderRadius: 'var(--radius-2)'
                }}>
                  {allDocuments.map((doc) => {
                    const isSelected = !!selectedDocuments.find(d => d._id === doc._id)
                    return (
                      <Flex 
                        key={doc._id} 
                        align="center" 
                        padding={3}
                        style={{ 
                          borderBottom: '1px solid var(--card-border-color)',
                          background: isSelected ? 'var(--card-selected-bg)' : 'transparent'
                        }}
                      >
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleDocument(doc._id)}
                          id={doc._id}
                        />
                        <Box marginLeft={3} flex={1}>
                          <Text size={1} weight="medium">
                            {doc.name || doc.title || 'Untitled'}
                          </Text>
                          <Text size={1} muted>
                            {doc.status && `• Status: ${doc.status}`}
                            {doc.price && ` • $${doc.price}`}
                            {doc.discount && ` • ${doc.discount}% off`}
                            {doc.inventory !== undefined && ` • ${doc.inventory} in stock`}
                          </Text>
                        </Box>
                      </Flex>
                    )
                  })}
                </Box>
              </>
            )}

            {allDocuments.length === 0 && !loading && (
              <Text muted>Click "Refresh List" to load {selectedType}s</Text>
            )}
          </Stack>
        </Card>

        {/* Update Configuration */}
        <Card padding={4} radius={2} shadow={1}>
          <Stack space={3}>
            <Label>3. Configure Update</Label>

            <Stack space={3}>
              <Box>
                <Label>Field to Update</Label>
                <select
                  value={updateField}
                  onChange={(e) => setUpdateField(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--radius-2)',
                    border: '1px solid var(--input-border-color)',
                    background: 'var(--input-bg)',
                    color: 'var(--input-color)',
                    fontSize: '14px',
                  }}
                >
                  <option value="">Select a field...</option>
                  {availableFields.map(f => (
                    <option key={f.name} value={f.name}>{f.title}</option>
                  ))}
                </select>
              </Box>

              {updateField && (
                <>
                  <Box>
                    <Label>Update Mode</Label>
                    <select
                      value={updateMode}
                      onChange={(e) => setUpdateMode(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: 'var(--radius-2)',
                        border: '1px solid var(--input-border-color)',
                        background: 'var(--input-bg)',
                        color: 'var(--input-color)',
                        fontSize: '14px',
                      }}
                    >
                      <option value="set">Set to value (replace)</option>
                      <option value="increase">Increase by</option>
                      <option value="decrease">Decrease by</option>
                      <option value="percentage">Change by percentage (%)</option>
                    </select>
                  </Box>

                  <Box>
                    <Label>
                      {updateField === 'status' 
                        ? 'New Status' 
                        : updateMode === 'percentage'
                        ? 'Percentage Change'
                        : 'New Value'}
                    </Label>
                    {updateField === 'status' ? (
                      <select
                        value={updateValue}
                        onChange={(e) => setUpdateValue(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: 'var(--radius-2)',
                          border: '1px solid var(--input-border-color)',
                          background: 'var(--input-bg)',
                          color: 'var(--input-color)',
                          fontSize: '14px',
                        }}
                      >
                        <option value="">Select status...</option>
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="archived">Archived</option>
                      </select>
                    ) : (
                      <TextInput
                        value={updateValue}
                        onChange={(e) => setUpdateValue(e.target.value)}
                        placeholder={
                          updateMode === 'percentage' 
                            ? "e.g., 10 for +10%, -15 for -15%" 
                            : "Enter value..."
                        }
                        type="number"
                        step="0.01"
                      />
                    )}
                    {updateMode === 'percentage' && (
                      <Text size={1} muted>
                        Use negative values to decrease by percentage
                      </Text>
                    )}
                  </Box>
                </>
              )}

              {updateField && updateValue && (
                <Card padding={3} radius={2} tone="primary">
                  <Text size={1}>
                    Will update <Code>{updateField}</Code> to <Code>{updateValue}</Code>{' '}
                    ({updateMode}) for <Code>{selectedDocuments.length}</Code> documents
                  </Text>
                </Card>
              )}
            </Stack>
          </Stack>
        </Card>

        {/* Action Buttons */}
        <Flex gap={3}>
          <Button
            mode="primary"
            onClick={performBulkUpdate}
            disabled={loading || !updateField || !updateValue || selectedDocuments.length === 0}
            text={loading ? 'Updating...' : `Update ${selectedDocuments.length} Documents`}
            flex={1}
          />
          <Button
            mode="default"
            onClick={() => {
              setUpdateField('')
              setUpdateValue('')
              setUpdateMode('set')
              setResults(null)
              setError(null)
            }}
            disabled={loading}
            text="Reset"
          />
        </Flex>

        {/* Results Display */}
        {results && (
          <Card padding={3} radius={2} tone="positive">
            <Text weight="bold">✓ {results.message}</Text>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card padding={3} radius={2} tone="critical">
            <Text>⚠ {error}</Text>
          </Card>
        )}
      </Stack>
    </div>
  )
}

export default BulkEditTool
