import { NextRequest, NextResponse } from 'next/server'
import { verifyRelicByNfcId } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: { nfcId: string } }
) {
  try {
    const result = await verifyRelicByNfcId(params.nfcId)

    if ('code' in result) {
      const status = result.code === 'INTERNAL_ERROR' ? 500 : 404
      return NextResponse.json(result, { status })
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'The archive is temporarily unreachable.' },
      { status: 500 }
    )
  }
}
