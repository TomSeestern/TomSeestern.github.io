import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * Interface representing the parameters expected by the page's `getStaticProps`.
 */
interface Params {
    params: {
        slug: string;
    };
}

/**
 * Interface representing the props expected by the Page component.
 */
interface PageProps {
    content: string;
    slug: string;
}

/**
 * Page component responsible for rendering the content of a markdown file.
 * The slug of the file is passed via props and used to determine which file's content to display.
 *
 * @param {Params} {params} - The object containing the slug parameter.
 * @returns {JSX.Element} - A JSX element representing the content of the markdown file.
 */
export default function Page({ params }: Params): JSX.Element {
    let content = null;

    try {
        const filePath = path.join(process.cwd(), 'app/blog/entry/', params.slug + '.md');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        content = matter(fileContents).content;
    } catch (e) {
        // Return 404 if the file doesn't exist or other errors occurred
        return <div>404</div>;
    }

    if (!content || !params.slug) {
        return <div>Loading...</div>;
    }

    // Render the content as is, or transform it to HTML as per your setup
    return (
        <article className="prose">
            <div>{content}</div>
        </article>
    );
}

/**
 * Generates static params for each markdown file found in the 'app/blog/entry' directory.
 * This function is expected to be used in conjunction with Next.js' `getStaticPaths` to
 * specify the routes that need to be pre-rendered at build time.
 *
 * @returns {Promise<{ slug: string }[]>} - An array of objects, each containing the slug for a post.
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
    const postsDirectory = path.join(process.cwd(), 'app/blog/entry');
    const filenames = fs.readdirSync(postsDirectory);

    return filenames.map((filename) => {
        const slug = filename.replace(/\.md$/, ''); // Remove the .md extension from filename
        return {slug};
    });
}
