import * as React from 'react'
import { InferGetStaticPropsType } from 'next'

import * as config from '@/lib/config'
import { Layout } from '@/components/Layout/Layout'
import { Markdown } from '@/components/Markdown/Markdown'
import { markdownToHtml } from '@/server/markdown-to-html'

import styles from './styles.module.css'

const markdownContent = `
## About

I love the [All-In Podcast](https://www.youtube.com/channel/UCESLZhusAkFfsNsApnjF_Cg), but podcasts make recall and discovery challenging.

This project uses the latest models from [OpenAI](https://openai.com/) to search every episode with Google-level accuracy and summarize the results.

You can use it to power advanced search across any YouTube channel or playlist. This demo uses the [All-In Podcast](https://www.youtube.com/channel/UCESLZhusAkFfsNsApnjF_Cg) because it's a podcast that I follow regularly.

## Example Queries

- [sweater karen](/?query=sweater+karen)
- [best advice for founders](/?query=best+advice+for+founders)
- [poker story from last night](/?query=poker+story+from+last+night)
- [crypto scam ponzi scheme](/?query=crypto+scam+ponzi+scheme)
- [luxury sweater chamath](/?query=luxury+sweater+chamath)
- [phil helmuth](/?query=phil+helmuth)
- [intellectual honesty](/?query=intellectual+honesty)
- [sbf](/?query=sbf)

## How It Works

This project is [open source](${config.githubRepoUrl}).

- [OpenAI](https://openai.com) - We use the [text-embedding-ada-002](https://openai.com/blog/new-and-improved-embedding-model/) embedding model
- [Pinecone](https://www.pinecone.io) - Hosted vector search across embeddings
- [Vercel](https://vercel.com) - Hosting and API functions
- [Next.js](https://nextjs.org) - React web framework

We use Node.js and the [YouTube API v3](https://developers.google.com/youtube/v3/getting-started) to fetch the videos of a playlist or channel. In this case, we're focused on the [All-In Podcast Episodes Playlist](https://www.youtube.com/playlist?list=PLn5MTSAqaf8peDZQ57QkJBzewJU1aUokl).

\`\`\`bash
npx tsx src/bin/resolve-yt-playlist.ts
\`\`\`

We then download all of the available English transcripts for each episode using a hacky HTML scraping solution, since the YouTube API doesn't allow non-OAuth access to captions. Note that a few episodes don't have automated English transcriptions available, so we're just skipping them at the moment.

Once we have all of the transcripts and metadata downloaded locally, we pre-process each video's transcripts, breaking them up into reasonably sized chunks of ~100 tokens and getting the [text-embedding-ada-002](https://openai.com/blog/new-and-improved-embedding-model/) embedding from OpenAI. This results in ~200 embeddings per episode.

All of these embeddings are then upserted into a [Pinecone](https://www.pinecone.io) index with a dimensionality of 1536. There are ~17,575 embeddings in total across ~108 episodes of the All-In Podcast.

\`\`\`bash
npx tsx src/bin/process-yt-playlist.ts
\`\`\`

Once our Pinecone search index is set up, we can start querying it either via the webapp or via the example CLI:

\`\`\`bash
npx tsx src/bin/query.ts
\`\`\`

## License

This project is [open source](${config.githubRepoUrl}). MIT © [${config.author}](${config.twitterUrl})

Support my open source work by [sponsoring me](${config.githubSponsorsUrl}) or <a href="${config.twitterUrl}">following me on twitter</a>.

The [All-In Podcast](https://www.allinpodcast.co/) is owned and operated by [Chamath Palihapitiya](https://twitter.com/chamath), [Jason Calacanis](https://twitter.com/jason), [David Sacks](https://twitter.com/DavidSacks), and [David Friedberg](https://twitter.com/friedberg).

**This webapp is not affiliated with the All-In Podcast**. It just pulls transcripts and metadata from their amazing [YouTube channel](https://www.youtube.com/channel/UCESLZhusAkFfsNsApnjF_Cg) and processes it using AI.
`

export default function AboutPage({
  content
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <div className={styles.aboutPage}>
        <div className={styles.meta}>
          <h1 className={styles.title}>{config.title}</h1>
          <p className={styles.detail}>
            <a
              className='link'
              href={config.twitterUrl}
              title={`Twitter ${config.twitter}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              By Travis Fischer
            </a>
          </p>
        </div>

        <Markdown content={content} />
      </div>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const content = await markdownToHtml(markdownContent)

  return {
    props: {
      content
    }
  }
}
