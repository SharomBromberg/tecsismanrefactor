import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  BlogComment,
  BlogCommentCreateInput,
  BlogPost,
  BlogPostAuthor,
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
    author: BlogPostAuthor,
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
      authorDisplayName: author.displayName.trim() || 'Administrador',
      authorUsername: author.username.trim().toLowerCase(),
      status: input.status,
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
            status: input.status,
          }
        : post,
    );

    this.writePosts(nextPosts);
    return { ok: true, message: 'Publicacion actualizada correctamente.' };
  }

  deleteComment(postId: string, commentId: string): void {
    const nextPosts = this.postsSubject.value.map((post) =>
      post.id === postId
        ? {
            ...post,
            comments: post.comments.filter((comment) => comment.id !== commentId),
          }
        : post,
    );
    this.writePosts(nextPosts);
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
        status: post.status ?? 'published',
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
        slug: 'migracion-segura-servidores-linux-virtualizacion',
        title: 'Migración segura a Servidores Linux y Virtualización Proxmox',
        excerpt:
          'Estrategias para consolidar servidores físicos, optimizar recursos empresariales y asegurar alta disponibilidad sin costos desmedidos de licenciamiento.',
        content:
          'La virtualización con Proxmox VE y clústeres Linux permite a las empresas modernizar su centro de datos local reduciendo la huella de hardware hasta en un 60%. En esta guía detallamos los pasos clave para migrar cargas de trabajo críticas: evaluación de IOPS en almacenamiento NVMe/SAS, configuración de redes con VLANs dedicadas para tráfico de réplica, y políticas de snapshots automatizados con retención offsite.',
        coverImage: 'assets/logos/4.png',
        category: 'Infraestructura',
        createdAt: new Date('2026-07-10').toISOString(),
        authorDisplayName: 'Ing. Carlos Mendoza · Tecsisman',
        status: 'published',
        comments: [
          {
            id: 'c-101',
            authorUsername: 'fernando.tech',
            authorDisplayName: 'Fernando Quintero',
            message: 'Excelente artículo. ¿Qué recomendación dan para el almacenamiento compartido entre 3 nodos Proxmox?',
            createdAt: new Date('2026-07-12').toISOString(),
          },
        ],
        reactions: { likes: ['carlos.m', 'admin'], dislikes: [] },
      },
      {
        id: 'seed-2',
        slug: 'seguridad-perimetral-y-mitigacion-ransomware',
        title: 'Seguridad perimetral y mitigación de ransomware en PYMES',
        excerpt:
          'Capas esenciales de defensa: segmentación de red, firewalls UTM, políticas de zero trust y copias de seguridad inmutables.',
        content:
          'El 80% de los incidentes de ransomware en pequeñas y medianas empresas se originan por puertos RDP expuestos a Internet o credenciales comprometidas en VPNs sin doble factor de autenticación (2FA). Implementar una arquitectura Zero Trust con firewalls de inspección profunda (NGFW), aislamiento de backups mediante almacenamiento WORM/inmutable y auditoría de accesos es la defensa más rentable y efectiva.',
        coverImage: 'assets/logos/3.png',
        category: 'Ciberseguridad',
        createdAt: new Date('2026-07-05').toISOString(),
        authorDisplayName: 'Equipo de Ciberseguridad · Tecsisman',
        status: 'published',
        comments: [],
        reactions: { likes: ['admin'], dislikes: [] },
      },
      {
        id: 'seed-3',
        slug: 'cableado-estructurado-y-redes-alta-velocidad',
        title: 'Diseño de cableado estructurado Cat 6A y Wi-Fi 6 empresarial',
        excerpt:
          'Cómo planificar la infraestructura física de telecomunicaciones para soportar transferencias de 10 Gbps y cientos de dispositivos simultáneos.',
        content:
          'La base de cualquier operación digital confiable es su red física. Un diseño de cableado estructurado bajo la norma TIA/EIA-568 con cable categoría 6A apantallado previene la diafonía y garantiza enlaces a 10 GbE en distancias de hasta 100 metros. Combinado con switches gestionables PoE+ y Access Points Wi-Fi 6 roaming, logramos coberturas continuas sin pérdidas de paquetes.',
        coverImage: 'assets/logos/2.png',
        category: 'Redes & Conectividad',
        createdAt: new Date('2026-06-28').toISOString(),
        authorDisplayName: 'Tecsisman Redes',
        status: 'published',
        comments: [],
        reactions: { likes: [], dislikes: [] },
      },
      {
        id: 'seed-4',
        slug: 'angular-escalable-para-ecommerce',
        title: 'Angular escalable para ecommerce y plataformas transaccionales',
        excerpt:
          'Patrones de arquitectura con Signals, componentes independientes (standalone) y micro-animaciones para tiendas de alto impacto.',
        content:
          'Una base de software moderna necesita componentes atómicos reutilizables, estados predecibles y una experiencia de compra fluida. En Tecsisman estructuramos nuestras aplicaciones con Angular Signals para reactividad fina, reducción de re-renderizados innecesarios y tiempos de carga instantáneos.',
        coverImage: 'assets/logos/4.png',
        category: 'Desarrollo Web',
        createdAt: new Date('2026-06-18').toISOString(),
        authorDisplayName: 'Tecsisman Devs',
        status: 'published',
        comments: [],
        reactions: { likes: [], dislikes: [] },
      },
      {
        id: 'seed-5',
        slug: 'mantenimiento-preventivo-servidores-estaciones-trabajo',
        title: 'Mantenimiento preventivo en servidores y estaciones de alto rendimiento',
        excerpt:
          'La diferencia entre fallos catastróficos y 99.9% de uptime: termopastas de alta conductividad, monitoreo SMART y limpieza de flujo de aire.',
        content:
          'El sobrecalentamiento silencioso y la degradación de pastas térmicas en procesadores Xeon/Core i9 causa estrangulamiento térmico (thermal throttling) y reduce la vida útil de los condensadores en la placa madre. Establecer cronogramas de mantenimiento semestral con cambio de materiales térmicos y pruebas de estrés previene paradas no programadas.',
        coverImage: 'assets/logos/1.png',
        category: 'Hardware & Soporte',
        createdAt: new Date('2026-06-10').toISOString(),
        authorDisplayName: 'Soporte Técnico Especializado',
        status: 'published',
        comments: [],
        reactions: { likes: [], dislikes: [] },
      },
    ];
  }
}
