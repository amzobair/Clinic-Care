import { useEffect } from "react"

// Updates the browser tab title when a page mounts or the title changes.
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ClinicCare` : "ClinicCare"
  }, [title])
}
