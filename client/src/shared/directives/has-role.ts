import { Directive, ViewContainerRef, Input, TemplateRef, inject, OnInit } from '@angular/core';
import { AccountService } from '../../core/services/account-service';

@Directive({
  selector: '[appHasRole]',
})
export class HasRole implements OnInit {
  @Input() appHasRole: string[] = [];
  private readonly accountService = inject(AccountService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly templateRef = inject(TemplateRef);

  ngOnInit(): void {
    if (
      this.accountService
        .currentUser()
        ?.roles?.some((r) => this.appHasRole.includes(r))
    ) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }
}