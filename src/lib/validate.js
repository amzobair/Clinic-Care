// Form validation rules for the booking form.
// Returns an object like { fullName: "error message" }. Empty object = valid.

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function dayName(dateString) {
  // "2026-11-28" -> "Sat" (parse as local date, not UTC)
  const [y, m, d] = dateString.split("-").map(Number)
  return DAY_NAMES[new Date(y, m - 1, d).getDay()]
}

export function todayString() {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, "0")
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export function validateBooking(values, doctor) {
  const errors = {}

  const name = values.fullName.trim()
  if (!name) errors.fullName = "Full name is required."
  else if (name.length < 3) errors.fullName = "Name must be at least 3 characters."
  else if (!/^[a-zA-Z.\s]+$/.test(name)) errors.fullName = "Use letters, spaces and dots only."

  if (!values.email.trim()) errors.email = "Email is required."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
    errors.email = "Enter a valid email, like name@example.com."

  // Bangladeshi mobile: 01 + operator digit 3-9 + 8 digits (11 digits total)
  if (!values.phone.trim()) errors.phone = "Phone number is required."
  else if (!/^01[3-9]\d{8}$/.test(values.phone.trim()))
    errors.phone = "Enter an 11-digit mobile number starting with 01."

  if (!values.age) errors.age = "Age is required."
  else if (!Number.isInteger(Number(values.age)) || values.age < 1 || values.age > 120)
    errors.age = "Age must be a whole number between 1 and 120."

  if (!values.doctorId) errors.doctorId = "Choose a doctor."

  if (!values.date) errors.date = "Pick a date."
  else if (values.date < todayString()) errors.date = "The date can't be in the past."
  else if (doctor && !doctor.days.includes(dayName(values.date)))
    errors.date = `${doctor.name} only sees patients on ${doctor.days.join(", ")}.`

  if (!values.time) errors.time = "Pick a time slot."

  const reason = values.reason.trim()
  if (reason.length < 10) errors.reason = "Describe the problem in at least 10 characters."
  else if (reason.length > 300) errors.reason = "Keep it under 300 characters."

  if (!values.agree) errors.agree = "Please accept the clinic policy."

  return errors
}
