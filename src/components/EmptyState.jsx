// Reusable "nothing here" box. `children` = an optional action button.
export default function EmptyState({ icon: Icon, title, children }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-background px-6 py-12 text-center">
      {Icon && <Icon className="float size-10 text-muted-foreground" />}
      <p className="font-medium">{title}</p>
      {children}
    </div>
  )
}
