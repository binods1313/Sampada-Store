import { writeClient } from './client'

export async function trackAICall({ model, callType, tokensUsed = 0, success = true }) {
  try {
    const today = new Date().toISOString().split('T')[0]

    const existing = await writeClient.fetch(
      `*[_type == "aiUsageLog" && date == $date && model == $model && callType == $callType][0]`,
      { date: today, model, callType }
    )

    if (existing) {
      await writeClient
        .patch(existing._id)
        .inc({
          count: 1,
          tokensUsed,
        })
        .commit()
    } else {
      await writeClient.create({
        _type: 'aiUsageLog',
        date: today,
        model,
        callType,
        count: 1,
        tokensUsed,
        success,
      })
    }
  } catch (err) {
    console.error('AI usage tracking error (non-fatal):', err.message)
  }
}