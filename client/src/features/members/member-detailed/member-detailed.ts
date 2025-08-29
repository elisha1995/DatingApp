import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Member } from '../../../types/member';
import { MemberService } from '../../../core/services/member-service';
import { filter, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-member-detailed',
  imports: [AsyncPipe, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css',
})
export class MemberDetailed implements OnInit {
  private readonly memberService = inject(MemberService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected title = signal<string | undefined>('Profile');
  protected member$?: Observable<Member>;

  ngOnInit(): void {
    this.member$ = this.loadMember();
    this.title.set(this.route.firstChild?.snapshot?.title)

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe({
        next: () => {
          this.title.set(this.route.firstChild?.snapshot?.title);
        },
      });
  }

  loadMember() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    return this.memberService.getMember(id);
  }
}
