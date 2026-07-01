import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { IconComponent } from 'src/app/shared/atoms/icon/icon.component';

@Component({
  selector: 'app-account-sidebar',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './account-sidebar.component.html',
  styleUrls: ['./account-sidebar.component.scss'],
})
export class AccountSidebarComponent {
  @Input() open = false;
  @Input() mobile = false;
  @Input() activeSection = 'profile';
  @Input() displayName = 'Usuario';
  @Input() email = '';

  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() sectionSelected = new EventEmitter<string>();
  @Output() logoutRequested = new EventEmitter<void>();

  selectSection(section: string): void {
    this.sectionSelected.emit(section);
  }
}
