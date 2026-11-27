import { cn } from "@/lib/utils"

export default function DoctorAvatar({ initials, size = "md" }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary",
        size === "lg" ? "size-20 text-2xl" : "size-12 text-base"
      )}
    >
      {initials}
    </div>
  )
}
