import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/interfaces/categories';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-categories-template',
  templateUrl: './categories-template.component.html',
  styleUrls: ['./categories-template.component.scss']
})
export class CategoriesTemplateComponent implements OnInit {

  categories: Category[] = [];
  newCategory: Category = { name: '' };
  constructor(private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoriesService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  createCategory(newCategory: Category): void {
    this.categoriesService.createCategory(newCategory).subscribe(createdCategory => {
      this.categories.push(createdCategory);
      newCategory.name = '';
    });
  }
  updateCategory(updatedCategory: Category): void {
    if (updatedCategory._id) { // Verificar si _id no es undefined
      this.categoriesService.updateCategory(updatedCategory._id, updatedCategory).subscribe(() => {
        const index = this.categories.findIndex(c => c._id === updatedCategory._id);
        if (index !== -1) {
          this.categories[index] = updatedCategory;
        }
      });
    } else {
      console.error('Error: _id is undefined');
    }
  }
  deleteCategory(id: string): void {
    this.categoriesService.deleteCategory(id).subscribe(() => {
      this.categories = this.categories.filter(c => c._id !== id);
    });
  }
}
