export interface BlogComment {
  id: string;
  authorUsername: string;
  authorDisplayName: string;
  message: string;
  createdAt: string;
}

export interface BlogReactions {
  likes: string[];
  dislikes: string[];
}

export type BlogPostStatus = 'draft' | 'in-review' | 'scheduled' | 'published';

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
  authorUsername?: string;
  status: BlogPostStatus;
  comments: BlogComment[];
  reactions: BlogReactions;
}

export interface BlogPostCreateInput {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  status: BlogPostStatus;
}

export interface BlogPostAuthor {
  username: string;
  displayName: string;
}

export interface BlogCommentCreateInput {
  authorUsername: string;
  authorDisplayName: string;
  message: string;
}

export interface BlogReactionInput {
  username: string;
  reaction: 'like' | 'dislike';
}
