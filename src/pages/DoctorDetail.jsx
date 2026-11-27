import { Link, useParams } from "react-router"
import { ArrowLeftIcon, StarIcon, UserXIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import DoctorAvatar from "@/components/DoctorAvatar"
import EmptyState from "@/components/EmptyState"
import { getDoctor, TIME_SLOTS } from "@/data/doctors"
import { usePageTitle } from "@/hooks/usePageTitle"

const WEEK = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"]

export default function DoctorDetail() {
  const { id } = useParams() // dynamic route segment: /doctors/:id
  const doctor = getDoctor(id)
  usePageTitle(doctor ? doctor.name : "Doctor not found")

  if (!doctor) {
    return (
      <EmptyState icon={UserXIcon} title="We could not find that doctor.">
        <Button asChild variant="outline">
          <Link to="/doctors">Back to doctors</Link>
        </Button>
      </EmptyState>
    )
  }

  return (
    <div className="grid gap-6">
      <Link
        to="/doctors"
        className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" /> All doctors
      </Link>

      <Card className="stagger">
        <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <DoctorAvatar initials={doctor.initials} size="lg" />
          <div className="grid flex-1 gap-2">
            <h1 className="text-2xl font-semibold">{doctor.name}</h1>
            <div className="flex flex-wrap gap-2">
              <Badge>{doctor.specialty}</Badge>
              <Badge variant="outline">{doctor.experience} years experience</Badge>
              <Badge variant="outline">
                <StarIcon className="fill-amber-400 text-amber-400" /> {doctor.rating}
              </Badge>
            </div>
            <p className="text-muted-foreground">{doctor.bio}</p>
          </div>
          <div className="grid gap-2 sm:text-right">
            <p className="text-sm text-muted-foreground">Consultation fee</p>
            <p className="text-2xl font-semibold">৳{doctor.fee}</p>
            <Button asChild>
              <Link to={`/book?doctor=${doctor.id}`}>Book appointment</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="stagger grid gap-4 sm:grid-cols-2" style={{ "--delay": "120ms" }}>
        <Card>
          <CardContent>
            <h2 className="mb-3 font-medium">Weekly schedule</h2>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {WEEK.map((day) => {
                const open = doctor.days.includes(day)
                return (
                  <div
                    key={day}
                    className={
                      open
                        ? "rounded-md bg-primary/10 py-2 font-medium text-primary"
                        : "rounded-md bg-muted py-2 text-muted-foreground line-through"
                    }
                  >
                    {day}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="mb-3 font-medium">Time slots</h2>
            <div className="flex flex-wrap gap-1.5">
              {TIME_SLOTS.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
