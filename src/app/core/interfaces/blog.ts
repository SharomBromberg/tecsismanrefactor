export interface BlogComment {
  id: string;
  authorUsername: string;
  authorDisplayName: string;
  message: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  createdAt: string;
  authorDisplayName: string;
  comments: BlogComment[];
}

export interface BlogPostCreateInput {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
}

export interface BlogCommentCreateInput {
  authorUsername: string;
  authorDisplayName: string;
  message: string;
}
