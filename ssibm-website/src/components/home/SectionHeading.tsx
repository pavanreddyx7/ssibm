type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
}

export function SectionHeading({ description, eyebrow, title }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl font-extrabold text-slate-950 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-8 text-slate-600">{description}</p>
      ) : null}
    </div>
  )
}
