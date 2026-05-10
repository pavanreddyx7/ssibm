type PageIntroProps = {
  eyebrow: string
  title: string
  description: string
}

export function PageIntro({ description, eyebrow, title }: PageIntroProps) {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-4xl font-display text-4xl font-extrabold leading-tight text-slate-950 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{description}</p>
      </div>
    </section>
  )
}
