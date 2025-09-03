import {
  Component,
  effect,
  ElementRef,
  inject,
  model,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MessageService } from '../../../core/services/message-service';
import { MemberService } from '../../../core/services/member-service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../../../types/message';

@Component({
  selector: 'app-member-messages',
  imports: [DatePipe, TimeAgoPipe, FormsModule],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css',
})
export class MemberMessages implements OnInit {
  @ViewChild('messageEndRef') messageEndRef!: ElementRef;
  protected messageService = inject(MessageService);
  private readonly memberService = inject(MemberService);
  private readonly route = inject(ActivatedRoute);
  protected messageContent = model('');

  protected messages = signal<Message[]>([]);

  constructor() {
    effect(() => {
      const currentMessages = this.messages();
      if (currentMessages.length > 0) {
        this.scrollToBottom();
      }
    });
  }
  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (memberId) {
      this.messageService.getMessageThread(memberId).subscribe({
        next: (messages) =>
          this.messages.set(
            messages.map((message) => ({
              ...message,
              currentUserSender: message.senderId === memberId,
            }))
          ),
      });
    }
  }

  sendMessage() {
    const recipientId = this.memberService.member()?.id;
    if (!recipientId) {
      return;
    }
    this.messageService
      .sendMessage(recipientId, this.messageContent())
      .subscribe({
        next: (message) =>
          this.messages.update((messages) => {
            message.currentUserSender = true;
            return [...messages, message];
          }),
      });
    this.messageContent.set('');
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.messageEndRef) {
        this.messageEndRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}
