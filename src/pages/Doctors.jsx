import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"
import { SearchXIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DoctorCard from "@/components/DoctorCard"
import EmptyState from "@/components/EmptyState"
import PageHeader from "@/components/PageHeader"
import { doctors, SPECIALTIES } from "@/data/doctors"
import { usePageTitle } from "@/hooks/usePageTitle"
import { cn } from "@/lib/utils"

export default function Doctors() {
  usePageTitle("Doctors")
  // The specialty filter lives in the URL (?specialty=Cardiology) so it can be shared.
  const [searchParams, setSearchParams] = useSearchParams()
  const specialty = searchParams.get("specialty") ?? "All"

  // Controlled search input + a debounced copy that is used for filtering.
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer) // cleanup: cancel if the user keeps typing
  }, [query])

  const filtered = doctors.filter((d) => {
    const matchesSpecialty = specialty === "All" || d.specialty === specialty
    const matchesQuery = d.name.toLowerCase().includes(debouncedQuery.trim().toLowerCase())
    return matchesSpecialty && matchesQuery
  })

  function chooseSpecialty(value) {
    setSearchParams(value === "All" ? {} : { specialty: value })
  }

  function clearFilters() {
    setQuery("")
    chooseSpecialty("All")
  }

  return (
    <>
      <PageHeader title="Our doctors" subtitle={`${filtered.length} of ${doctors.length} doctors shown`} />

      <div className="mb-6 grid gap-3">
        <Input
          type="search"
          placeholder="Search by name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm bg-background"
          aria-label="Search doctors by name"
        />
        <div className="flex flex-wrap gap-2">
          {["All", ...SPECIALTIES].map((s) => (
            <Button
              key={s}
              size="sm"
              variant={s === specialty ? "default" : "outline"}
              className={cn(s !== specialty && "bg-background")}
              onClick={() => chooseSpecialty(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        // Changing the key when the filter changes remounts the grid, so the cards animate in again
        <div key={`${specialty}|${debouncedQuery}`} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doctor, i) => (
            <DoctorCard key={doctor.id} doctor={doctor} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState icon={SearchXIcon} title="No doctors match your search.">
          <Button variant="outline" onClick={clearFilters}>
            Clear filters
          </Button>
        </EmptyState>
      )}
    </>
  )
}
