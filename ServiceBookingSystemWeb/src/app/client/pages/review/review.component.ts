import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ClientService } from '../../services/client.service';
import { UserStorageService } from 'src/app/basic/services/storage/user-storage.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  bookId: number = this.activatedroute.snapshot.params['Id'];
  validateForm: FormGroup;
  isSubmitting = false;

  constructor(
    private clientService: ClientService,
    private fb: FormBuilder,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.validateForm = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1)]],
      review: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });

    // Log form status changes for debugging
    this.validateForm.statusChanges.subscribe(status => {
      console.log('Form status:', status);
      console.log('Form errors:', this.validateForm.errors);
      console.log('Rating errors:', this.validateForm.get('rating')?.errors);
      console.log('Review errors:', this.validateForm.get('review')?.errors);
    });
  }

  getRatingDescription(rating: number): string {
    const descriptions = {
      1: 'Rất không hài lòng',
      2: 'Không hài lòng',
      3: 'Bình thường',
      4: 'Hài lòng',
      5: 'Rất hài lòng'
    };
    return descriptions[rating] || '';
  }

  giveReview() {
    if (this.validateForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      console.log('Submitting review with data:', this.validateForm.value);

      const reviewDTO = {
        rating: this.validateForm.get('rating')?.value,
        review: this.validateForm.get('review')?.value,
        userId: UserStorageService.getUserId(),
        bookId: this.bookId
      };

      this.clientService.giveReview(reviewDTO).subscribe({
        next: () => {
          this.notification.success(
            'Thành công',
            'Đánh giá của bạn đã được gửi thành công',
            { nzDuration: 5000 }
          );
          this.router.navigateByUrl('/client/bookings');
        },
        error: (error) => {
          console.error('Error posting review:', error);
          this.notification.error(
            'Lỗi',
            'Không thể gửi đánh giá. Vui lòng thử lại sau.',
            { nzDuration: 5000 }
          );
          this.isSubmitting = false;
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.validateForm.controls).forEach(key => {
        const control = this.validateForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
