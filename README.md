# ClinicCare — Doctor Appointment Booking SPA

A single page app where patients browse doctors, view their weekly schedule, and book or cancel appointments.

Built with **React 19 + Vite**, **Tailwind CSS v4**, **shadcn/ui** and **React Router**.

## Features

- Doctor list with a debounced name search and a specialty filter (the filter is saved in the URL)
- Doctor profile pages at `/doctors/:id`
- Booking form with validation that checks each field as you go
- Booked slots are blocked, so the same doctor can't be double-booked
- "My Appointments" page with a confirm-before-cancel dialog
- Data is kept in `localStorage`, so bookings survive a page refresh
- 404 page for unknown routes

## Where each requirement lives

| Requirement | Where to look |
|---|---|
| Vite React project | `vite.config.js`, `package.json` |
| Controlled inputs | `src/pages/Book.jsx`: one `values` state object, every input has `value` + `onChange` |
| Form validation | `src/lib/validate.js` (rules) + `Book.jsx` (errors show after blur or submit) |
| Props & children | `PageHeader`, `FormField`, `EmptyState` take `children`; `DoctorCard`, `DoctorAvatar` take props |
| `useState` | form values, touched fields, search query, dialog target |
| `useEffect` | `hooks/useLocalStorage.js` (save on change), `hooks/usePageTitle.js` (tab title), `Doctors.jsx` (debounce with cleanup), `Book.jsx` (sync `?doctor=` into the form) |
| React Router | `App.jsx` (nested routes + layout), `NavLink` active styles, `useParams`, `useSearchParams`, `useNavigate`, `useOutletContext` |
| Tailwind + shadcn/ui | Button, Card, Input, Label, Textarea, Select, Badge, Dialog, Sonner (toasts) in `src/components/ui` |

### Validation rules

- Name: at least 3 characters, letters, spaces and dots only
- Email: valid format
- Mobile: Bangladeshi 11-digit number starting with `01`
- Age: whole number from 1 to 120
- Date: not in the past, and only on the chosen doctor's working days
- Time: required, and the slot must not already be booked
- Reason: 10 to 300 characters
- Clinic policy checkbox must be ticked

## Debugging notes (talking points)

- **State not updating right away:** `setValues` doesn't change `values` until the next render, so errors are *derived* from `values` on every render instead of being stored separately.
- **Stale state:** updates use the function form, `setValues(v => ({ ...v, [field]: value }))`, so quick changes never overwrite each other.
- **Effect running too often:** the debounce effect returns `clearTimeout` as cleanup and only depends on `[query]`.
- **Date off by one day:** `new Date("2026-11-28")` is parsed as UTC; `dayName()` builds a local date instead.
- **Refresh gives 404 after deploy:** fixed with `vercel.json` / `public/_redirects` so every path serves `index.html`.
- Tools used: React DevTools (Components tab to inspect props/state), browser console, `npm run lint`.

## Run locally

```bash
npm install
npm run dev
```

Build for production with `npm run build`.

## Project structure

```
src/
  App.jsx               routes
  components/           Layout, DoctorCard, FormField, PageHeader, EmptyState, DoctorAvatar
  components/ui/        shadcn/ui components
  data/doctors.js       doctor data + time slots
  hooks/                useLocalStorage, usePageTitle
  lib/validate.js       form validation
  pages/                Home, Doctors, DoctorDetail, Book, Appointments, NotFound
```

## Deploy

Works on Vercel or Netlify out of the box: build command `npm run build`, output folder `dist`.
