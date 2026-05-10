type DashboardShellProps = {
  title: string
  description: string
}

export function DashboardShell({ description, title }: DashboardShellProps) {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
          Dashboard Preview
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-slate-950">{title}</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">{description}</p>
      </div>
    </section>
  )
}
