import { useState } from "react"
import { Link, useOutletContext } from "react-router"
import { toast } from "sonner"
import { CalendarXIcon, ClockIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import DoctorAvatar from "@/components/DoctorAvatar"
import EmptyState from "@/components/EmptyState"
import PageHeader from "@/components/PageHeader"
import { getDoctor } from "@/data/doctors"
import { usePageTitle } from "@/hooks/usePageTitle"
import { todayString } from "@/lib/validate"

export default function Appointments() {
  usePageTitle("My appointments")
  const { appointments, setAppointments } = useOutletContext()
  const [toCancel, setToCancel] = useState(null) // appointment waiting for confirmation

  const sorted = [...appointments].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
  const today = todayString()

  function confirmCancel() {
    setAppointments((list) => list.filter((a) => a.id !== toCancel.id))
    toast.success("Appointment cancelled.")
    setToCancel(null)
  }

  return (
    <>
      <PageHeader title="My appointments" subtitle={`${appointments.length} booked`}>
        <Button asChild>
          <Link to="/book">New booking</Link>
        </Button>
      </PageHeader>

      {sorted.length === 0 ? (
        <EmptyState icon={CalendarXIcon} title="You have no appointments yet.">
          <Button asChild variant="outline">
            <Link to="/doctors">Find a doctor</Link>
          </Button>
        </EmptyState>
      ) : (
        <ul className="grid gap-3">
          {sorted.map((a, i) => (
            <AppointmentItem
              key={a.id}
              index={i}
              appointment={a}
              isPast={a.date < today}
              onCancel={() => setToCancel(a)}
            />
          ))}
        </ul>
      )}

      {/* Controlled dialog: open whenever toCancel holds an appointment */}
      <Dialog open={toCancel !== null} onOpenChange={(open) => !open && setToCancel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel this appointment?</DialogTitle>
            <DialogDescription>
              {toCancel && `${getDoctor(toCancel.doctorId)?.name} on ${toCancel.date} at ${toCancel.time}. This cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Keep it</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmCancel}>
              Yes, cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function AppointmentItem({ appointment, isPast, onCancel, index }) {
  const doctor = getDoctor(appointment.doctorId)
  return (
    <li className="stagger" style={{ "--delay": `${index * 70}ms` }}>
      <Card className={isPast ? "opacity-60" : "hover-lift"}>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <DoctorAvatar initials={doctor?.initials ?? "?"} />
          <div className="grid flex-1 gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">{doctor?.name ?? "Unknown doctor"}</p>
              <Badge variant={isPast ? "outline" : "secondary"}>{isPast ? "Past" : "Upcoming"}</Badge>
            </div>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <ClockIcon className="size-3.5" /> {appointment.date} at {appointment.time} · for {appointment.fullName}
            </p>
            <p className="text-sm">{appointment.reason}</p>
          </div>
          {!isPast && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </CardContent>
      </Card>
    </li>
  )
}
