import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { BlogPost } from '@core/interfaces/blog';
import { AuthService } from '@core/services/auth.service';
import { BlogService } from '@core/services/blog.service';
import { ButtonComponent } from '@shared/atoms/button/button.component';
import { PageHeaderComponent } from '@shared/organisms/page-header/page-header.component';

export interface BlogPostVm extends BlogPost {
  likesCount: number;
  dislikesCount: number;
  activeReaction: 'like' | 'dislike' | null;
  readTimeMinutes: number;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    DatePipe,
    ButtonComponent,
    PageHeaderComponent,
  ],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent {
  private readonly blogService = inject(BlogService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly selectedCategory = signal<string>('Todos');
  readonly searchQuery = signal<string>('');
  readonly expandedPostId = signal<string | null>(null);
  readonly newsletterSubscribed = signal<boolean>(false);
  newsletterEmail = '';

  readonly categories = [
    'Todos',
    'Infraestructura',
    'Ciberseguridad',
    'Redes & Conectividad',
    'Desarrollo Web',
    'Hardware & Soporte',
  ];

  readonly rawPosts$ = this.blogService.posts$.pipe(
    map((posts) => posts.filter((post) => post.status === 'published')),
  );

  readonly postsVm$ = this.blogService.posts$.pipe(
    map((posts) => posts.filter((post) => post.status === 'published')),
    map((posts) => {
      const vms = posts.map((post) => this.toPostVm(post));
      return {
        allPosts: vms,
        featuredPost: vms[0] ?? null,
        totalPosts: vms.length,
        totalComments: vms.reduce(
          (accumulator, post) => accumulator + post.comments.length,
          0,
        ),
      };
    }),
  );

  readonly commentForms = new Map<string, ReturnType<FormBuilder['group']>>();
  readonly feedbackByPostId: Record<string, string> = {};

  get currentSession() {
    return this.authService.currentSession();
  }

  get isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  trackByPostId(index: number, post: BlogPost): string {
    return post.id || `${index}`;
  }

  setCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  filterPosts(posts: BlogPostVm[]): BlogPostVm[] {
    const cat = this.selectedCategory();
    const query = this.searchQuery().toLowerCase().trim();

    return posts.filter((post) => {
      const matchCategory = cat === 'Todos' || post.category === cat;
      const matchQuery =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query);

      return matchCategory && matchQuery;
    });
  }

  togglePostExpand(postId: string): void {
    if (this.expandedPostId() === postId) {
      this.expandedPostId.set(null);
    } else {
      this.expandedPostId.set(postId);
    }
  }

  getCommentForm(postId: string) {
    if (!this.commentForms.has(postId)) {
      this.commentForms.set(
        postId,
        this.fb.group({
          message: [
            '',
            [
              Validators.required,
              Validators.minLength(8),
              Validators.maxLength(600),
            ],
          ],
        }),
      );
    }

    return this.commentForms.get(postId)!;
  }

  submitComment(post: BlogPost): void {
    if (!this.currentSession) {
      void this.router.navigate(['/login'], {
        queryParams: { redirectTo: '/Blog' },
      });
      return;
    }

    const form = this.getCommentForm(post.id);
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    const result = this.blogService.addComment(post.id, {
      authorUsername: this.currentSession.username,
      authorDisplayName: this.currentSession.displayName,
      message: form.controls['message'].value ?? '',
    });

    this.feedbackByPostId[post.id] =
      result.message ??
      (result.ok
        ? '¡Comentario publicado correctamente!'
        : 'No fue posible publicar el comentario.');

    if (result.ok) {
      form.reset();
    }
  }

  react(post: BlogPost, reaction: 'like' | 'dislike'): void {
    if (!this.currentSession) {
      void this.router.navigate(['/login'], {
        queryParams: { redirectTo: '/Blog' },
      });
      return;
    }

    this.blogService.reactToPost(post.id, {
      username: this.currentSession.username,
      reaction,
    });
  }

  subscribeNewsletter(): void {
    if (this.newsletterEmail && this.newsletterEmail.includes('@')) {
      this.newsletterSubscribed.set(true);
      this.newsletterEmail = '';
    }
  }

  private toPostVm(post: BlogPost): BlogPostVm {
    const username = this.currentSession?.username?.trim().toLowerCase() ?? '';
    const words = post.content ? post.content.split(/\s+/).length : 0;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 180));

    return {
      ...post,
      likesCount: post.reactions.likes.length,
      dislikesCount: post.reactions.dislikes.length,
      readTimeMinutes,
      activeReaction: post.reactions.likes.includes(username)
        ? 'like'
        : post.reactions.dislikes.includes(username)
          ? 'dislike'
          : null,
    };
  }
}
