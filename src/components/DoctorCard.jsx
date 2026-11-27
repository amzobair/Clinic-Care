import { Link } from "react-router"
import { StarIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import DoctorAvatar from "./DoctorAvatar"

// Reusable card for one doctor. Receives the doctor object via props.
// `index` delays the entrance animation so cards appear one after another.
export default function DoctorCard({ doctor, index = 0 }) {
  return (
    <Card className="stagger hover-lift h-full" style={{ "--delay": `${index * 80}ms` }}>
      <CardHeader className="flex flex-row items-center gap-3">
        <DoctorAvatar initials={doctor.initials} />
        <div>
          <CardTitle>{doctor.name}</CardTitle>
          <CardDescription>
            {doctor.specialty} · {doctor.experience} yrs
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 text-sm">
        <p className="text-muted-foreground">{doctor.bio}</p>
        <div className="mt-auto flex flex-wrap items-center gap-2">
          <Badge variant="secondary">৳{doctor.fee}</Badge>
          <Badge variant="outline">
            <StarIcon className="fill-amber-400 text-amber-400" /> {doctor.rating}
          </Badge>
          <span className="text-xs text-muted-foreground">{doctor.days.join(" · ")}</span>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link to={`/doctors/${doctor.id}`}>Profile</Link>
        </Button>
        <Button asChild className="flex-1">
          <Link to={`/book?doctor=${doctor.id}`}>Book</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
