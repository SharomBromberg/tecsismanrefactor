import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogPost, BlogPostCreateInput } from '@core/interfaces/blog';

@Component({
  selector: 'app-admin-blog-post-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './blog-post-form.component.html',
  styleUrls: ['./blog-post-form.component.scss'],
})
export class BlogPostFormComponent implements OnChanges {
  @Input() post: BlogPost | null = null;
  @Input() feedback = '';
  @Output() createPost = new EventEmitter<BlogPostCreateInput>();
  @Output() updatePost = new EventEmitter<{
    postId: string;
    payload: BlogPostCreateInput;
  }>();
  @Output() cancelEdit = new EventEmitter<void>();

  private readonly fb = new FormBuilder();

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(6)]],
    category: ['', [Validators.required]],
    coverImage: ['assets/logos/4.png', [Validators.required]],
    excerpt: ['', [Validators.required, Validators.minLength(20)]],
    content: ['', [Validators.required, Validators.minLength(80)]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if ('post' in changes) {
      this.syncForm();
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload: BlogPostCreateInput = {
      title: raw.title ?? '',
      excerpt: raw.excerpt ?? '',
      content: raw.content ?? '',
      coverImage: raw.coverImage ?? '',
      category: raw.category ?? '',
    };

    if (this.post) {
      this.updatePost.emit({ postId: this.post.id, payload });
    } else {
      this.createPost.emit(payload);
    }

    this.resetForm();
  }

  handleCancel(): void {
    this.resetForm();
    this.cancelEdit.emit();
  }

  get title(): string {
    return this.post ? 'Editar publicacion del blog' : 'Crear publicacion para el blog';
  }

  get submitLabel(): string {
    return this.post ? 'Guardar cambios' : 'Publicar entrada';
  }

  private syncForm(): void {
    if (!this.post) {
      this.resetForm();
      return;
    }

    this.form.reset({
      title: this.post.title,
      category: this.post.category,
      coverImage: this.post.coverImage,
      excerpt: this.post.excerpt,
      content: this.post.content,
    });
  }

  private resetForm(): void {
    this.form.reset({
      title: '',
      category: '',
      coverImage: 'assets/logos/4.png',
      excerpt: '',
      content: '',
    });
  }
}