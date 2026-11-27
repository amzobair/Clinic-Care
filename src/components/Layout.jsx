import { NavLink, Outlet, useLocation } from "react-router"
import { HeartPulseIcon } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { cn } from "@/lib/utils"

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/doctors", label: "Doctors" },
  { to: "/book", label: "Book" },
  { to: "/appointments", label: "My Appointments" },
]

// Shared layout: navbar + page content (<Outlet />) + footer.
// Appointments state lives here so every page can read/change it.
export default function Layout() {
  const [appointments, setAppointments] = useLocalStorage("cliniccare.appointments", [])
  const location = useLocation()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <HeartPulseIcon className="heartbeat size-5 text-primary" />
            ClinicCare
          </NavLink>
          <ul className="flex flex-wrap gap-1 text-sm">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    cn(
                      "rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                      isActive && "bg-primary/10 font-medium text-primary"
                    )
                  }
                >
                  {link.label}
                  {link.to === "/appointments" && appointments.length > 0 && (
                    <span key={appointments.length} className="fade-in ml-1.5 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                      {appointments.length}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {/* A new key on every route change remounts this div, which replays the page-enter animation */}
        <div key={location.pathname} className="page-enter">
          <Outlet context={{ appointments, setAppointments }} />
        </div>
      </main>

      <footer className="border-t bg-background py-4 text-center text-xs text-muted-foreground">
        ClinicCare · Week 13 project · React + Vite + Tailwind CSS + shadcn/ui
      </footer>
      <Toaster richColors position="top-center" />
    </div>
  )
}
