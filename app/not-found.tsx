export default function NotFound() {
  return (
    <section className="mx-auto content-center items-center bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-primary-600 dark:text-primary-500 lg:text-9xl">
            404
          </h1>
          <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
            Etwas fehlt.
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            Entschuldigung, wir können diese Seite nicht finden. <br /> Auf der Startseite gibt es aber viel zu
            entdecken.
          </p>
          <a
            href="/"
            className="my-4 inline-flex rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
          >
            Zurück zur Startseite
          </a>
        </div>
      </div>
    </section>
  )
}
