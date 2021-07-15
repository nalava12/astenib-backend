export interface Post {
  title: string
  content: string //base64 encoded
  id: string // nanoid \w custom chracters (hangul)
  time: number
}

export type Database = { posts: Post[] }