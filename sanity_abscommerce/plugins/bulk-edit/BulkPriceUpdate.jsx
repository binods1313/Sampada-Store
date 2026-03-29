/**
 * Bulk Price Update Tool
 * Specialized tool for updating product prices in bulk
 * 
 * Features:
 * - Update prices by category
 * - Apply percentage increases/decreases
 * - Set price ranges
 * - Preview changes before applying
 */

import React, { useState, useCallback, useEffect } from 'react'
import { Box, Button, Card, Flex, Stack, Text, TextInput, Label, Badge, Spinner } from '@sanity/ui'
import { useClient } from 'sanity'

export function BulkPriceUpdate() {
  const client = useClient({ apiVersion: '2024-05-18' })
  
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [updateType, setUpdateType] = useState('percentage')
  const [updateValue, setUpdateValue] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [pricePreview, setPricePreview] = useState([])
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  // Fetch products and categories
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch products
      const productsQuery = `*[_type == 'product'] | order(name asc) { 
        _id, 
        name, 
        slug, 
        price, 
        discount, 
        inventory,
        status,
        category->{_id, name}
      }`
      const productsData = await client.fetch(productsQuery)
      setProducts(productsData)

      // Fetch categories
      const categoriesQuery = `*[_type == 'category'] | order(name asc) { _id, name }`
      const categoriesData = await client.fetch(categoriesQuery)
      setCategories([{ _id: 'all', name: 'All Categories' }, ...categoriesData])
    } catch (err) {
      setError(`Failed to fetch data: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Filter products by category
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category?._id === selectedCategory)

  // Calculate price preview
  useEffect(() => {
    if ((updateValue || (updateType === 'set' && newPrice)) && filteredProducts.length > 0) {
      const value = updateType === 'set' ? parseFloat(newPrice) : parseFloat(updateValue)
      if (isNaN(value)) {
        setPricePreview([])
        return
      }

      const preview = filteredProducts.map(product => {
        let newPriceValue
        const currentPrice = product.price || 0

        switch (updateType) {
          case 'percentage':
            newPriceValue = currentPrice * (1 + value / 100)
            break
          case 'fixed':
            newPriceValue = currentPrice + value
            break
          case 'set':
            newPriceValue = value
            break
          default:
            newPriceValue = currentPrice
        }

        return {
          ...product,
          currentPrice,
          newPrice: Math.round(newPriceValue * 100) / 100,
          change: Math.round((newPriceValue - currentPrice) * 100) / 100,
          changePercent: currentPrice > 0 
            ? Math.round(((newPriceValue - currentPrice) / currentPrice) * 100) 
            : 0
        }
      })
      setPricePreview(preview)
    } else {
      setPricePreview([])
    }
  }, [updateValue, newPrice, updateType, filteredProducts, selectedCategory])

  // Apply bulk price update
  const applyPriceUpdate = async () => {
    if (pricePreview.length === 0) {
      setError('No products to update')
      return
    }

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      // Execute updates in batches
      const batchSize = 50
      let updated = 0

      for (let i = 0; i < pricePreview.length; i += batchSize) {
        const batch = pricePreview.slice(i, i + batchSize)
        const transactions = batch.map(product => 
          client.patch(product._id).set({
            price: product.newPrice,
            updatedAt: new Date().toISOString()
          })
        )
        
        await client.transaction(...transactions).commit()
        updated += batch.length
      }

      setResults({
        success: true,
        updated,
        message: `Successfully updated prices for ${updated} products`
      })

      // Refresh data
      fetchData()
      
      // Reset form
      setUpdateValue('')
      setNewPrice('')
      setPricePreview([])
    } catch (err) {
      setError(`Price update failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Calculate summary statistics
  const summary = pricePreview.length > 0 ? {
    totalProducts: pricePreview.length,
    avgCurrentPrice: (pricePreview.reduce((sum, p) => sum + p.currentPrice, 0) / pricePreview.length).toFixed(2),
    avgNewPrice: (pricePreview.reduce((sum, p) => sum + p.newPrice, 0) / pricePreview.length).toFixed(2),
    totalChange: pricePreview.reduce((sum, p) => sum + p.change, 0).toFixed(2),
  } : null

  return (
    <div style={{ padding: '16px', maxWidth: '1200px', margin: '0 auto' }}>
      <Stack space={4}>
        {/* Header */}
        <Box>
          <Text weight="bold" size={4}>💰 Bulk Price Update</Text>
          <Text muted>Update product prices across your catalog</Text>
        </Box>

        {/* Category Filter */}
        <Card padding={4} radius={2} shadow={1}>
          <Stack space={3}>
            <Label>Filter by Category</Label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <Text size={1} muted>
              Showing {filteredProducts.length} of {products.length} products
            </Text>
          </Stack>
        </Card>

        {/* Update Configuration */}
        <Card padding={4} radius={2} shadow={1}>
          <Stack space={3}>
            <Label>Update Type</Label>
            <select
              value={updateType}
              onChange={(e) => setUpdateType(e.target.value)}
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
              <option value="percentage">Percentage Change (%)</option>
              <option value="fixed">Fixed Amount (+/- $)</option>
              <option value="set">Set Specific Price</option>
            </select>

            {updateType === 'set' ? (
              <Box>
                <Label>New Price ($)</Label>
                <TextInput
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="Enter new price..."
                  type="number"
                  step="0.01"
                />
              </Box>
            ) : (
              <Box>
                <Label>
                  {updateType === 'percentage' ? 'Percentage Change (%)' : 'Amount ($)'}
                </Label>
                <TextInput
                  value={updateValue}
                  onChange={(e) => setUpdateValue(e.target.value)}
                  placeholder={updateType === 'percentage' ? "e.g., 10 for +10%, -15 for -15%" : "e.g., 5 for +$5, -3 for -$3"}
                  type="number"
                  step="0.01"
                />
                <Text size={1} muted>
                  Use negative values to decrease prices
                </Text>
              </Box>
            )}
          </Stack>
        </Card>

        {/* Summary Statistics */}
        {summary && (
          <Card padding={4} radius={2} tone="primary">
            <Stack space={2}>
              <Text weight="bold">Preview Summary</Text>
              <Flex wrap="wrap" gap={2}>
                <Badge tone="default">
                  {summary.totalProducts} products
                </Badge>
                <Badge tone="default">
                  Avg: ${summary.avgCurrentPrice} → ${summary.avgNewPrice}
                </Badge>
                <Badge tone={summary.totalChange >= 0 ? 'positive' : 'critical'}>
                  Total: ${summary.totalChange}
                </Badge>
              </Flex>
            </Stack>
          </Card>
        )}

        {/* Price Preview Table */}
        {pricePreview.length > 0 && (
          <Card padding={4} radius={2} shadow={1}>
            <Stack space={3}>
              <Text weight="bold">Price Changes Preview</Text>
              <Box style={{ 
                maxHeight: '400px', 
                overflow: 'auto',
                border: '1px solid var(--card-border-color)',
                borderRadius: 'var(--radius-2)'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ 
                    position: 'sticky', 
                    top: 0, 
                    background: 'var(--card-bg)',
                    zIndex: 1
                  }}>
                    <tr>
                      <th style={thStyle}>Product</th>
                      <th style={thStyle}>Current</th>
                      <th style={thStyle}>New</th>
                      <th style={thStyle}>Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricePreview.slice(0, 50).map((product) => (
                      <tr key={product._id} style={{ borderBottom: '1px solid var(--card-border-color)' }}>
                        <td style={tdStyle}>
                          <Text size={1}>{product.name}</Text>
                          {product.category && (
                            <Text size={1} muted>{product.category.name}</Text>
                          )}
                        </td>
                        <td style={tdStyle}>${product.currentPrice.toFixed(2)}</td>
                        <td style={tdStyle}>${product.newPrice.toFixed(2)}</td>
                        <td style={tdStyle}>
                          <Badge tone={product.change >= 0 ? 'positive' : 'critical'}>
                            {product.change >= 0 ? '+' : ''}{product.change.toFixed(2)}
                            {product.changePercent !== 0 && ` (${product.changePercent >= 0 ? '+' : ''}${product.changePercent}%)`}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {pricePreview.length > 50 && (
                  <Box padding={3}>
                    <Text size={1} muted>
                      ... and {pricePreview.length - 50} more products
                    </Text>
                  </Box>
                )}
              </Box>
            </Stack>
          </Card>
        )}

        {/* Action Buttons */}
        <Flex gap={3}>
          <Button
            mode="primary"
            onClick={applyPriceUpdate}
            disabled={loading || pricePreview.length === 0 || (!updateValue && updateType !== 'set')}
            text={loading ? 'Updating...' : `Apply Price Updates (${pricePreview.length} products)`}
            flex={1}
          />
          <Button
            mode="default"
            onClick={() => {
              setUpdateValue('')
              setNewPrice('')
              setPricePreview([])
              setResults(null)
              setError(null)
            }}
            disabled={loading}
            text="Reset"
          />
        </Flex>

        {/* Results */}
        {results && (
          <Card padding={4} radius={2} tone="positive">
            <Text weight="bold">✓ {results.message}</Text>
          </Card>
        )}

        {/* Errors */}
        {error && (
          <Card padding={4} radius={2} tone="critical">
            <Text>⚠ {error}</Text>
          </Card>
        )}
      </Stack>
    </div>
  )
}

const thStyle = {
  padding: '12px',
  textAlign: 'left',
  fontWeight: '600',
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: 'var(--card-muted-color)',
  borderBottom: '2px solid var(--card-border-color)',
}

const tdStyle = {
  padding: '12px',
  fontSize: '13px',
}

export default BulkPriceUpdate
