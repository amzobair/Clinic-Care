import { Link } from "react-router"
import { CompassIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import EmptyState from "@/components/EmptyState"
import { usePageTitle } from "@/hooks/usePageTitle"

export default function NotFound() {
  usePageTitle("Page not found")
  return (
    <EmptyState icon={CompassIcon} title="404 · This page does not exist.">
      <Button asChild>
        <Link to="/">Go home</Link>
      </Button>
    </EmptyState>
  )
}
