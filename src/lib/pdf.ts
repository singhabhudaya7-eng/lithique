export const runtime = 'nodejs'

import type { Provenance, Relic } from '@/types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export async function generateCertificatePdf(
  relic: Pick<Relic, 'name' | 'tagline' | 'tier' | 'nfcId'>,
  provenance: Provenance
): Promise<Uint8Array> {
  const {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    pdf,
    Font,
  } = await import('@react-pdf/renderer')
  const { createElement: h } = await import('react')

  const styles = StyleSheet.create({
    page: {
      backgroundColor: '#0A0A0A',
      padding: 60,
      fontFamily: 'Helvetica',
    },
    header: {
      borderBottomWidth: 1,
      borderBottomColor: '#C9A84C',
      borderBottomStyle: 'solid',
      paddingBottom: 24,
      marginBottom: 32,
    },
    brand: {
      fontSize: 10,
      color: '#C9A84C',
      letterSpacing: 4,
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      color: '#FAF7F2',
      marginBottom: 8,
    },
    tagline: {
      fontSize: 12,
      color: '#FAF7F2',
      opacity: 0.6,
      fontStyle: 'italic',
    },
    sectionLabel: {
      fontSize: 8,
      color: '#C9A84C',
      letterSpacing: 3,
      marginBottom: 6,
      marginTop: 20,
    },
    sectionValue: {
      fontSize: 14,
      color: '#FAF7F2',
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: '#2A2520',
      borderBottomStyle: 'solid',
      marginVertical: 16,
    },
    ownerEntry: {
      marginBottom: 12,
    },
    ownerName: {
      fontSize: 12,
      color: '#FAF7F2',
    },
    ownerDate: {
      fontSize: 9,
      color: '#C9A84C',
      opacity: 0.7,
      marginTop: 2,
    },
    ownerNote: {
      fontSize: 10,
      color: '#FAF7F2',
      opacity: 0.5,
      fontStyle: 'italic',
      marginTop: 3,
    },
    footer: {
      marginTop: 40,
      borderTopWidth: 1,
      borderTopColor: '#2A2520',
      borderTopStyle: 'solid',
      paddingTop: 16,
    },
    nfcId: {
      fontSize: 8,
      color: '#C9A84C',
      opacity: 0.5,
      letterSpacing: 1,
    },
    generatedAt: {
      fontSize: 8,
      color: '#FAF7F2',
      opacity: 0.3,
      marginTop: 4,
    },
  })

  const ownerChain = provenance.ownerChain

  const doc = h(
    Document,
    null,
    h(
      Page,
      { size: 'A4', style: styles.page },
      h(
        View,
        { style: styles.header },
        h(Text, { style: styles.brand }, 'LITHIQUE BY SHWETA'),
        h(Text, { style: styles.title }, relic.name),
        h(Text, { style: styles.tagline }, relic.tagline)
      ),
      h(Text, { style: styles.sectionLabel }, 'STONE'),
      h(Text, { style: styles.sectionValue }, provenance.stoneType),
      h(View, { style: styles.divider }),
      h(Text, { style: styles.sectionLabel }, 'QUARRY'),
      h(
        Text,
        { style: styles.sectionValue },
        `${provenance.quarryName}, ${provenance.quarryRegion}`
      ),
      h(View, { style: styles.divider }),
      h(Text, { style: styles.sectionLabel }, 'ARTISAN'),
      h(
        Text,
        { style: styles.sectionValue },
        provenance.artisanAtelier
          ? `${provenance.artisanName} — ${provenance.artisanAtelier}`
          : provenance.artisanName
      ),
      h(View, { style: styles.divider }),
      h(Text, { style: styles.sectionLabel }, 'CREATION'),
      h(Text, { style: styles.sectionValue }, formatDate(provenance.creationDate)),
      ownerChain.length > 0
        ? h(
            View,
            null,
            h(View, { style: styles.divider }),
            h(Text, { style: styles.sectionLabel }, 'CHAIN OF CUSTODY'),
            ...ownerChain.map((entry, i) =>
              h(
                View,
                { key: String(i), style: styles.ownerEntry },
                h(Text, { style: styles.ownerName }, entry.name),
                h(Text, { style: styles.ownerDate }, formatDate(entry.acquiredAt)),
                entry.transferNote
                  ? h(Text, { style: styles.ownerNote }, entry.transferNote)
                  : null
              )
            )
          )
        : null,
      provenance.notes
        ? h(
            View,
            null,
            h(View, { style: styles.divider }),
            h(Text, { style: styles.sectionLabel }, 'ARCHIVE NOTE'),
            h(
              Text,
              { style: { ...styles.sectionValue, fontSize: 11, fontStyle: 'italic', opacity: 0.7 } },
              provenance.notes
            )
          )
        : null,
      h(
        View,
        { style: styles.footer },
        relic.nfcId
          ? h(Text, { style: styles.nfcId }, `NFC ID: ${relic.nfcId}`)
          : null,
        h(
          Text,
          { style: styles.generatedAt },
          `Certificate generated ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`
        )
      )
    )
  )

  const instance = pdf(doc)
  const blob = await instance.toBlob()
  const buffer = await blob.arrayBuffer()
  return new Uint8Array(buffer)
}
