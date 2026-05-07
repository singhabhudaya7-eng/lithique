import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendInquiryNotification } from '@/lib/email'

const inquirySchema = z.object({
  relicId: z.string().min(1),
  relicName: z.string().min(1),
  relicSlug: z.string().min(1),
  clientName: z.string().min(1).max(200),
  clientEmail: z.string().email(),
  clientPhone: z.string().max(30).optional(),
  message: z.string().min(1).max(2000),
  isWaitlist: z.boolean().default(false),
})

function sanitize(text: string) {
  return text.replace(/<[^>]*>/g, '').trim()
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = inquirySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Your submission could not be processed. Please review the form.' },
        { status: 400 }
      )
    }

    const data = parsed.data
    const sanitized = {
      ...data,
      clientName: sanitize(data.clientName),
      message: sanitize(data.message),
      clientPhone: data.clientPhone ? sanitize(data.clientPhone) : undefined,
    }

    // Save to DB if available, otherwise log for dev
    if (process.env.DATABASE_URL) {
      const { prisma } = await import('@/lib/prisma')
      await prisma.inquiry.create({
        data: {
          relicId: sanitized.relicId,
          clientName: sanitized.clientName,
          clientEmail: sanitized.clientEmail,
          clientPhone: sanitized.clientPhone ?? null,
          message: sanitized.message,
          isWaitlist: sanitized.isWaitlist,
        },
      })
    } else {
      console.log('[DEV] Inquiry received:', {
        name: sanitized.clientName,
        email: sanitized.clientEmail,
        relic: sanitized.relicName,
        waitlist: sanitized.isWaitlist,
      })
    }

    // Fire-and-forget email — does not block response
    sendInquiryNotification({
      clientName: sanitized.clientName,
      clientEmail: sanitized.clientEmail,
      clientPhone: sanitized.clientPhone,
      message: sanitized.message,
      relicName: sanitized.relicName,
      relicSlug: sanitized.relicSlug,
      isWaitlist: sanitized.isWaitlist,
    }).catch(() => {
      // non-blocking — do not fail the request if email fails
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'The archive encountered an unexpected difficulty. Please try again.' },
      { status: 500 }
    )
  }
}
