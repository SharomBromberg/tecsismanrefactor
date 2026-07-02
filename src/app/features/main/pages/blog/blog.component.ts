import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { BlogPost } from 'src/app/core/interfaces/blog';
import { AuthService } from 'src/app/core/services/auth.service';
import { BlogService } from 'src/app/core/services/blog.service';
import { ButtonComponent } from 'src/app/shared/atoms/button/button.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    AsyncPipe,
    DatePipe,
    ButtonComponent,
  ],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent {
  private readonly blogService = inject(BlogService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly postsVm$ = this.blogService.posts$.pipe(
    map((posts) => ({
      featuredPost: posts[0] ?? null,
      posts: posts.slice(1),
      totalPosts: posts.length,
      totalComments: posts.reduce(
        (accumulator, post) => accumulator + post.comments.length,
        0,
      ),
    })),
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
        ? 'Comentario publicado.'
        : 'No fue posible publicar el comentario.');

    if (result.ok) {
      form.reset();
    }
  }
}
