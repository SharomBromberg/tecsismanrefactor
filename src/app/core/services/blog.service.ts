import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  BlogComment,
  BlogCommentCreateInput,
  BlogPost,
  BlogPostCreateInput,
  BlogReactionInput,
} from '../interfaces/blog';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly storageKey = 'tecsisman_blog_posts';
  private readonly postsSubject = new BehaviorSubject<BlogPost[]>(
    this.readPosts(),
  );

  readonly posts$ = this.postsSubject.asObservable();

  createPost(
    input: BlogPostCreateInput,
    authorDisplayName: string,
  ): { ok: boolean; message?: string } {
    const normalizedTitle = input.title.trim();
    const normalizedExcerpt = input.excerpt.trim();
    const normalizedContent = input.content.trim();
    const normalizedCategory = input.category.trim();
    const normalizedCoverImage = input.coverImage.trim();

    if (
      !normalizedTitle ||
      !normalizedExcerpt ||
      !normalizedContent ||
      !normalizedCategory ||
      !normalizedCoverImage
    ) {
      return { ok: false, message: 'Completa todos los campos del post.' };
    }

    const nextPost: BlogPost = {
      id: `${Date.now()}`,
      slug: this.buildSlug(normalizedTitle),
      title: normalizedTitle,
      excerpt: normalizedExcerpt,
      content: normalizedContent,
      coverImage: normalizedCoverImage,
      category: normalizedCategory,
      createdAt: new Date().toISOString(),
      authorDisplayName: authorDisplayName.trim() || 'Administrador',
      comments: [],
      reactions: { likes: [], dislikes: [] },
    };

    const nextPosts = [nextPost, ...this.postsSubject.value];
    this.writePosts(nextPosts);
    return { ok: true };
  }

  deletePost(postId: string): void {
    const nextPosts = this.postsSubject.value.filter(
      (post) => post.id !== postId,
    );
    this.writePosts(nextPosts);
  }

  updatePost(
    postId: string,
    input: BlogPostCreateInput,
  ): { ok: boolean; message?: string } {
    const normalizedTitle = input.title.trim();
    const normalizedExcerpt = input.excerpt.trim();
    const normalizedContent = input.content.trim();
    const normalizedCategory = input.category.trim();
    const normalizedCoverImage = input.coverImage.trim();

    if (
      !normalizedTitle ||
      !normalizedExcerpt ||
      !normalizedContent ||
      !normalizedCategory ||
      !normalizedCoverImage
    ) {
      return { ok: false, message: 'Completa todos los campos del post.' };
    }

    const nextPosts = this.postsSubject.value.map((post) =>
      post.id === postId
        ? {
            ...post,
            slug: this.buildSlug(normalizedTitle),
            title: normalizedTitle,
            excerpt: normalizedExcerpt,
            content: normalizedContent,
            category: normalizedCategory,
            coverImage: normalizedCoverImage,
          }
        : post,
    );

    this.writePosts(nextPosts);
    return { ok: true, message: 'Publicacion actualizada correctamente.' };
  }

  addComment(
    postId: string,
    input: BlogCommentCreateInput,
  ): { ok: boolean; message?: string } {
    const normalizedMessage = input.message.trim();
    if (normalizedMessage.length < 8) {
      return {
        ok: false,
        message: 'Tu comentario debe tener al menos 8 caracteres.',
      };
    }

    const nextComment: BlogComment = {
      id: `${Date.now()}`,
      authorUsername: input.authorUsername.trim().toLowerCase(),
      authorDisplayName: input.authorDisplayName.trim(),
      message: normalizedMessage,
      createdAt: new Date().toISOString(),
    };

    const nextPosts = this.postsSubject.value.map((post) =>
      post.id === postId
        ? { ...post, comments: [...post.comments, nextComment] }
        : post,
    );
    this.writePosts(nextPosts);
    return { ok: true };
  }

  reactToPost(
    postId: string,
    input: BlogReactionInput,
  ): { ok: boolean; activeReaction: 'like' | 'dislike' | null } {
    const normalizedUsername = input.username.trim().toLowerCase();
    if (!normalizedUsername) {
      return { ok: false, activeReaction: null };
    }

    let activeReaction: 'like' | 'dislike' | null = null;

    const nextPosts = this.postsSubject.value.map((post) => {
      if (post.id !== postId) {
        return post;
      }

      const currentReactions = post.reactions ?? { likes: [], dislikes: [] };
      const likes = currentReactions.likes.filter(
        (username) => username !== normalizedUsername,
      );
      const dislikes = currentReactions.dislikes.filter(
        (username) => username !== normalizedUsername,
      );

      const isSameReactionActive =
        (input.reaction === 'like' && currentReactions.likes.includes(normalizedUsername)) ||
        (input.reaction === 'dislike' && currentReactions.dislikes.includes(normalizedUsername));

      const nextReactions = isSameReactionActive
        ? { likes, dislikes }
        : input.reaction === 'like'
          ? { likes: [...likes, normalizedUsername], dislikes }
          : { likes, dislikes: [...dislikes, normalizedUsername] };

      activeReaction = isSameReactionActive ? null : input.reaction;

      return {
        ...post,
        reactions: nextReactions,
      };
    });

    this.writePosts(nextPosts);
    return { ok: true, activeReaction };
  }

  private readPosts(): BlogPost[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return this.seedPosts();
    }

    try {
      const parsed = JSON.parse(raw) as BlogPost[];
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return this.seedPosts();
      }

      return parsed.map((post) => ({
        ...post,
        reactions: post.reactions ?? { likes: [], dislikes: [] },
      }));
    } catch {
      return this.seedPosts();
    }
  }

  private writePosts(posts: BlogPost[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(posts));
    this.postsSubject.next(posts);
  }

  private buildSlug(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private seedPosts(): BlogPost[] {
    return [
      {
        id: 'seed-1',
        slug: 'angular-escalable-para-ecommerce',
        title: 'Angular escalable para ecommerce moderno',
        excerpt:
          'Patrones de arquitectura, performance y experiencia de usuario para tiendas que quieren crecer sin rehacer el frontend.',
        content:
          'Una base de ecommerce bien pensada necesita componentes reutilizables, estados predecibles y una experiencia de compra clara. En Tecsisman priorizamos interfaces consistentes, tiempos de carga bajos y superficies preparadas para integrarse con APIs, autenticacion y analitica sin rehacer el producto.',
        coverImage: 'assets/logos/4.png',
        category: 'Frontend',
        createdAt: new Date('2026-06-18').toISOString(),
        authorDisplayName: 'Tecsisman',
        comments: [],
        reactions: { likes: [], dislikes: [] },
      },
      {
        id: 'seed-2',
        slug: 'seguridad-real-para-sesiones-y-formularios',
        title: 'Seguridad real para sesiones y formularios',
        excerpt:
          'Que validar en registro, login, contacto y comentarios antes de conectar tu API definitiva.',
        content:
          'El frontend no reemplaza al backend en seguridad, pero si puede preparar el terreno correctamente. Reglas claras de contraseñas, mensajes coherentes, expiracion de sesion, limitacion de intentos y estructuras tipadas reducen errores cuando llega el momento de integrar servicios reales.',
        coverImage: 'assets/logos/3.png',
        category: 'Seguridad',
        createdAt: new Date('2026-06-22').toISOString(),
        authorDisplayName: 'Tecsisman',
        comments: [],
        reactions: { likes: [], dislikes: [] },
      },
      {
        id: 'seed-3',
        slug: 'diseno-que-convierte-mas',
        title: 'Diseño que convierte mas y se siente premium',
        excerpt:
          'Hero, cards, checkout y contenido editorial deben hablar el mismo lenguaje visual si quieres una app memorable.',
        content:
          'La simetria no es rigidez: es coherencia entre espaciado, jerarquia tipografica, acciones primarias y ritmo visual. Cuando home, carrito, blog y paneles comparten reglas claras, la experiencia parece mas profesional y la conversion mejora.',
        coverImage: 'assets/logos/2.png',
        category: 'UX/UI',
        createdAt: new Date('2026-06-25').toISOString(),
        authorDisplayName: 'Tecsisman',
        comments: [],
        reactions: { likes: [], dislikes: [] },
      },
    ];
  }
}
