import fs from "fs"
import path from "path"
import matter from "gray-matter"
import ReactMarkdown from "react-markdown"
import {Breadcrumb, BreadcrumbItem} from "flowbite-react"
import {HiHome} from "react-icons/hi"
import {Metadata, ResolvingMetadata} from "next"

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
    const filePath = path.join(process.cwd(), "app/blog/entry/", params.slug + ".md")
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
      <Breadcrumb className="py-2">
        <BreadcrumbItem href="/" icon={HiHome}>
          Home
        </BreadcrumbItem>
        <BreadcrumbItem href="/blog">Blog</BreadcrumbItem>
        <BreadcrumbItem className="truncate">{fileContent.data.title || "Content "}</BreadcrumbItem>
      </Breadcrumb>

      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <article className="prose">
          <ReactMarkdown className="">{fileContent.content}</ReactMarkdown>
        </article>
      </div>
    </>
  )
}

/**
 * Generates static params for each markdown file found in the 'app/blog/entry' directory.
 * This function is expected to be used in conjunction with Next.js' `getStaticPaths` to
 * specify the routes that need to be pre-rendered at build time.
 *
 * @returns {Promise<{ slug: string }[]>} - An array of objects, each containing the slug for a post.
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const postsDirectory = path.join(process.cwd(), "app/blog/entry")
  const filenames = fs.readdirSync(postsDirectory)

  return filenames.map((filename) => {
    const slug = filename.replace(/\.md$/, "") // Remove the .md extension from filename
    return { slug }
  })
}

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Params, parent: ResolvingMetadata): Promise<Metadata> {
  let fileContent = null

  try {
    const filePath = path.join(process.cwd(), "app/blog/entry/", params.slug + ".md")
    const fileContents = fs.readFileSync(filePath, "utf8")
    fileContent = matter(fileContents)
  } catch (e) {}

  return {
    title: fileContent?.data.title?.toString() || "TomSegbers.de",
    openGraph: {
      images: [],
    },
  }
}
