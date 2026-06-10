import { LinkPreview } from '../ui/link-preview'

export function AboutDetail() {
  return (
    <div className="flex justify-center items-center h-[40rem] flex-col px-4">
      <p className="text-muted-foreground text-xl md:text-3xl max-w-3xl mx-auto mb-10">
        <LinkPreview
          url="https://tailwindcss.com"
          className="font-bold text-primary"
        >
          Jatahin
        </LinkPreview>{' '}
        adalah platform yang akan memudahkan dirimu untuk mengatur keuangan
        kamu{' '}
      </p>
      <p className="text-muted-foreground text-xl md:text-3xl max-w-3xl mx-auto">
        Mau lihat project lainnya? kunjungi{' '}
        <LinkPreview
          url="https://kevinalvarel.my.id"
          className="font-bold bg-clip-text text-primary z-99"
        >
          Portofolio
        </LinkPreview>{' '}
        aku untuk project lainnya
      </p>
    </div>
  )
}
