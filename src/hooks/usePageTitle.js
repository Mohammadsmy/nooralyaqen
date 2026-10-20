import { useEffect } from 'react'

const SITE = 'نور اليقين · Noor Al-Yaqeen'

export function usePageTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : SITE
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    }
  }, [title, description])
}
