import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

export type LocaleStubTone = 'inverse' | 'default';

@Component({
  selector: 'app-locale-stub',
  standalone: true,
  templateUrl: './locale-stub.component.html',
  styleUrls: ['./locale-stub.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LocaleStubComponent {
  @Input() tone: LocaleStubTone = 'inverse';
  @Input() block: boolean = false;
}
