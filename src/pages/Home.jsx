import { Link } from "react-router"
import { CalendarCheckIcon, ShieldCheckIcon, StethoscopeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import DoctorCard from "@/components/DoctorCard"
import { doctors } from "@/data/doctors"
import { usePageTitle } from "@/hooks/usePageTitle"

const features = [
  { icon: StethoscopeIcon, title: "Trusted specialists", text: "Six doctors across five specialties." },
  { icon: CalendarCheckIcon, title: "Book in a minute", text: "Pick a doctor, a day and a time slot." },
  { icon: ShieldCheckIcon, title: "Your data stays here", text: "Appointments are saved in your browser." },
]

export default function Home() {
  usePageTitle("Home")
  const topRated = [...doctors].sort((a, b) => b.rating - a.rating).slice(0, 3)

  return (
    <div className="grid gap-12">
      <section className="relative grid gap-5 overflow-hidden rounded-2xl bg-linear-to-br from-(--hero-from) to-(--hero-to) px-6 py-12 text-white sm:px-10">
        {/* Decorative floating icon (hidden from screen readers) */}
        <StethoscopeIcon
          aria-hidden="true"
          className="float pointer-events-none absolute -right-6 -bottom-8 size-48 text-white/10 sm:right-8 sm:size-56"
        />
        <h1 className="stagger max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
          See the right doctor, without the waiting room queue.
        </h1>
        <p className="stagger max-w-lg text-white/80" style={{ "--delay": "100ms" }}>
          Browse specialists, check their days, and book your appointment online.
        </p>
        <div className="stagger flex flex-wrap gap-3" style={{ "--delay": "200ms" }}>
          <Button asChild size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50">
            <Link to="/book">Book an appointment</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
            <Link to="/doctors">Browse doctors</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, text }, i) => (
          <Card key={title} className="stagger hover-lift" style={{ "--delay": `${300 + i * 80}ms` }}>
            <CardContent className="flex gap-3">
              <Icon className="size-6 shrink-0 text-primary" />
              <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold">Top rated doctors</h2>
          <Link to="/doctors" className="text-sm text-primary hover:underline">
            See all →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topRated.map((doctor, i) => (
            <DoctorCard key={doctor.id} doctor={doctor} index={i + 5} />
          ))}
        </div>
      </section>
    </div>
  )
}
