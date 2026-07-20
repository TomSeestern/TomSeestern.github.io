import fs from "fs"
import path from "path"
import matter from "gray-matter"
import ReactMarkdown from "react-markdown"
import { Breadcrumb, BreadcrumbItem } from "flowbite-react"
import { HiHome } from "react-icons/hi"
import { Metadata, ResolvingMetadata } from "next"

/**
 * Interface representing the parameters expected by the page's `getStaticProps`.
 */
interface Params {
  params: {
    slug: string
  }
}

/**
 * Page component responsible for rendering the content of a markdown file.
 * The slug of the file is passed via props and used to determine which file's content to display.
 *
 * @param {Params} {params} - The object containing the slug parameter.
 * @returns {JSX.Element} - A JSX element representing the content of the markdown file.
 */
export default function Page({ params }: Params): JSX.Element {
  let fileContent = null

  try {
    const filePath = path.join(process.cwd(), "content/projects/", params.slug + ".md")
    const fileContents = fs.readFileSync(filePath, "utf8")
    fileContent = matter(fileContents)
  } catch (e) {
    // Return 404 if the file doesn't exist or other errors occurred
    return <div>404</div>
  }

  if (!fileContent || !params.slug) {
    return <div>Loading...</div>
  }

  // Render the fileContent as is, or transform it to HTML as per your setup
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Breadcrumb className="py-2">
          <BreadcrumbItem href="/" icon={HiHome}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
          <BreadcrumbItem className="truncate">{fileContent.data.title || "Content "}</BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8 sm:px-6 sm:py-16 lg:py-24">
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <h1 className="text-h1-sm sm:text-h1">{fileContent.data.title || "Project"}</h1>
          <ReactMarkdown components={{ h1: () => null }}>{fileContent.content}</ReactMarkdown>
        </article>
      </div>
    </>
  )
}

/**
 * Generates static params for each markdown file found in the 'content/projects' directory.
 * This function is expected to be used in conjunction with Next.js' `getStaticPaths` to
 * specify the routes that need to be pre-rendered at build time.
 *
 * @returns {Promise<{ slug: string }[]>} - An array of objects, each containing the slug for a post.
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const postsDirectory = path.join(process.cwd(), "content/projects")
  const filenames = fs.readdirSync(postsDirectory)

  return filenames.map((filename) => {
    const slug = filename.replace(/\.md$/, "") // Remove the .md extension from filename
    return { slug }
  })
}

/**
 * Generates the Metadata for the page component.
 * Results in the Blog Post's title being displayed in the browser tab.
 *
 * @param {Params} {params} - The object containing the slug parameter.
 * @returns {Promise<{ props: Params }>} - The props for the page component.
 */
export async function generateMetadata({ params }: Params, parent: ResolvingMetadata): Promise<Metadata> {
  let fileContent = null

  try {
    const filePath = path.join(process.cwd(), "content/projects/", params.slug + ".md")
    const fileContents = fs.readFileSync(filePath, "utf8")
    fileContent = matter(fileContents)
  } catch (e) {}

  const title = fileContent?.data.title?.toString() || "Project"
  const description = fileContent?.data.articleContent?.toString() || ""

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [
        {
          url: "/img/logo.png",
          width: 512,
          height: 512,
          alt: "TomSegbers.de logo",
        },
      ],
    },
  }
}
