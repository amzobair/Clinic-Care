import { useEffect, useState } from "react"
import { useNavigate, useOutletContext, useSearchParams } from "react-router"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import FormField from "@/components/FormField"
import PageHeader from "@/components/PageHeader"
import { doctors, getDoctor, TIME_SLOTS } from "@/data/doctors"
import { usePageTitle } from "@/hooks/usePageTitle"
import { cn } from "@/lib/utils"
import { todayString, validateBooking } from "@/lib/validate"

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phone: "",
  age: "",
  doctorId: "",
  date: "",
  time: "",
  reason: "",
  agree: false,
}

export default function Book() {
  usePageTitle("Book an appointment")
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { appointments, setAppointments } = useOutletContext()

  // One state object holds every input value -> all inputs are "controlled".
  const [values, setValues] = useState({ ...EMPTY_FORM, doctorId: searchParams.get("doctor") ?? "" })
  // Which fields the user has left (blur) -> only show their errors.
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)

  // If the user clicks "Book" on another doctor while already on this page,
  // the ?doctor= value changes; keep the dropdown in sync with the URL.
  useEffect(() => {
    const fromUrl = searchParams.get("doctor")
    if (fromUrl && getDoctor(fromUrl)) {
      setValues((v) => ({ ...v, doctorId: fromUrl }))
    }
  }, [searchParams])

  const doctor = getDoctor(values.doctorId)

  // Errors are derived from the current values on every render.
  const errors = validateBooking(values, doctor)
  const slotTaken = appointments.some(
    (a) => a.doctorId === values.doctorId && a.date === values.date && a.time === values.time
  )
  if (slotTaken && !errors.time) errors.time = "This slot is already booked. Pick another time."

  const showError = (field) => (touched[field] || submitted ? errors[field] : undefined)

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }))
  }

  function handleChange(e) {
    const { name, type, value, checked } = e.target
    update(name, type === "checkbox" ? checked : value)
  }

  function handleBlur(e) {
    setTouched((t) => ({ ...t, [e.target.name]: true }))
  }

  function handleSubmit(e) {
    e.preventDefault() // stop the browser from reloading the page
    setSubmitted(true)
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the highlighted fields.")
      return
    }
    const appointment = {
      id: crypto.randomUUID(),
      ...values,
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      reason: values.reason.trim(),
      createdAt: new Date().toISOString(),
    }
    setAppointments((list) => [...list, appointment])
    toast.success(`Booked with ${doctor.name} on ${values.date} at ${values.time}.`)
    navigate("/appointments")
  }

  function handleReset() {
    setValues(EMPTY_FORM)
    setTouched({})
    setSubmitted(false)
  }

  // Helper to give every text input the same wiring.
  const inputProps = (name) => ({
    id: name,
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    "aria-invalid": Boolean(showError(name)),
    "aria-describedby": showError(name) ? `${name}-error` : undefined,
  })

  return (
    <>
      <PageHeader title="Book an appointment" subtitle="All fields are required." />

      <form onSubmit={handleSubmit} noValidate className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormField id="fullName" label="Full name" error={showError("fullName")}>
                  <Input {...inputProps("fullName")} placeholder="Rahim Uddin" autoComplete="name" />
                </FormField>
              </div>
              <FormField id="email" label="Email" error={showError("email")}>
                <Input {...inputProps("email")} type="email" placeholder="you@example.com" autoComplete="email" />
              </FormField>
              <FormField id="phone" label="Mobile number" error={showError("phone")} hint="11 digits, e.g. 01712345678">
                <Input {...inputProps("phone")} type="tel" inputMode="numeric" maxLength={11} placeholder="01XXXXXXXXX" />
              </FormField>
              <FormField id="age" label="Age" error={showError("age")}>
                <Input {...inputProps("age")} type="number" min={1} max={120} />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appointment</CardTitle>
              <CardDescription>Each doctor works on certain days only.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField id="doctorId" label="Doctor" error={showError("doctorId")}>
                <Select
                  value={values.doctorId}
                  onValueChange={(v) => {
                    update("doctorId", v)
                    setTouched((t) => ({ ...t, doctorId: true }))
                  }}
                >
                  <SelectTrigger id="doctorId" className="w-full" aria-invalid={Boolean(showError("doctorId"))}>
                    <SelectValue placeholder="Choose a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name} · {d.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                id="date"
                label="Date"
                error={showError("date")}
                hint={doctor ? `Available: ${doctor.days.join(", ")}` : undefined}
              >
                <Input {...inputProps("date")} type="date" min={todayString()} />
              </FormField>

              <div className="grid gap-1.5 sm:col-span-2">
                <span className="text-sm font-medium" id="time-label">
                  Time slot
                </span>
                <div role="radiogroup" aria-labelledby="time-label" className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {TIME_SLOTS.map((t) => {
                    const taken = appointments.some(
                      (a) => a.doctorId === values.doctorId && a.date === values.date && a.time === t
                    )
                    return (
                      <Button
                        key={t}
                        type="button"
                        role="radio"
                        aria-checked={values.time === t}
                        variant={values.time === t ? "default" : "outline"}
                        disabled={taken}
                        className={cn(taken && "line-through")}
                        onClick={() => {
                          update("time", t)
                          setTouched((s) => ({ ...s, time: true }))
                        }}
                      >
                        {t}
                      </Button>
                    )
                  })}
                </div>
                {showError("time") && <p className="text-sm text-destructive">{showError("time")}</p>}
              </div>

              <div className="sm:col-span-2">
                <FormField
                  id="reason"
                  label="Reason for visit"
                  error={showError("reason")}
                  hint={`${values.reason.trim().length}/300 characters`}
                >
                  <Textarea {...inputProps("reason")} rows={4} placeholder="Knee pain for two weeks, worse when climbing stairs…" />
                </FormField>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary sidebar updates live as the user types (state -> UI) */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
                <dt className="text-muted-foreground">Patient</dt>
                <dd className="truncate">{values.fullName || "—"}</dd>
                <dt className="text-muted-foreground">Doctor</dt>
                <dd>{doctor?.name ?? "—"}</dd>
                <dt className="text-muted-foreground">When</dt>
                <dd>{values.date ? `${values.date} ${values.time}` : "—"}</dd>
                <dt className="text-muted-foreground">Fee</dt>
                <dd className="font-semibold">{doctor ? `৳${doctor.fee}` : "—"}</dd>
              </dl>

              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="agree"
                  checked={values.agree}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-0.5 size-4 accent-primary"
                />
                <span>I will arrive 10 minutes early and cancel at least 2 hours before if I can&apos;t come.</span>
              </label>
              {showError("agree") && <p className="-mt-2 text-sm text-destructive">{showError("agree")}</p>}

              <Button type="submit" size="lg">
                Confirm booking
              </Button>
              <Button type="button" variant="ghost" onClick={handleReset}>
                Clear form
              </Button>
            </CardContent>
          </Card>
        </aside>
      </form>
    </>
  )
}
