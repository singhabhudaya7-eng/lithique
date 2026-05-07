export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { verifyRelicByNfcId } from '@/lib/db'
import { generateCertificatePdf } from '@/lib/pdf'

export async function GET(
  _req: NextRequest,
  { params }: { params: { nfcId: string } }
) {
  const result = await verifyRelicByNfcId(params.nfcId)

  if ('code' in result) {
    return NextResponse.json(result, { status: 404 })
  }

  try {
    const pdfBytes = await generateCertificatePdf(
      { ...result.relic, nfcId: params.nfcId },
      result.provenance
    )

    return new NextResponse(pdfBytes.buffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="lithique-certificate-${params.nfcId.slice(0, 8)}.pdf"`,
      },
    })
  } catch {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'The certificate could not be generated.' },
      { status: 500 }
    )
  }
}
