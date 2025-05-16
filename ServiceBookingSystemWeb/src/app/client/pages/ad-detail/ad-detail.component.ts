import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserStorageService } from 'src/app/basic/services/storage/user-storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-ad-detail',
  templateUrl: './ad-detail.component.html',
  styleUrls: ['./ad-detail.component.scss']
})
export class AdDetailComponent implements OnInit {
  adId: string;
  avatarUrl: string = 'assets/default-avatar.png';
  ad: any = null;
  reviews: any[] = [];
  validateForm!: FormGroup;
  totalPrice: number = 0;
  isLoading: boolean = false;
  isBooking: boolean = false;
  today = new Date();

  constructor(
    private clientService: ClientService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private notification: NzNotificationService
  ) {
    this.adId = this.activatedRoute.snapshot.params['adId'];
  }

  ngOnInit() {
    this.initForm();
    this.getAdDetailsByAdId();
  }

  disabledDate = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return current && current < tomorrow;
  };

  private initForm() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    this.validateForm = this.fb.group({
      startDate: [tomorrow, [Validators.required]],
      endDate: [dayAfterTomorrow, [Validators.required]],
      message: ['', [Validators.required, Validators.maxLength(500)]]
    }, { validators: [this.dateRangeValidator, this.futureDateValidator] });

    this.validateForm.get('startDate')?.valueChanges.subscribe(() => {
      this.calculateTotalPrice();
    });
    this.validateForm.get('endDate')?.valueChanges.subscribe(() => {
      this.calculateTotalPrice();
    });
  }

  private dateRangeValidator(group: FormGroup) {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;

    if (start && end) {
      const isRangeValid = end > start;
      return isRangeValid ? null : { dateRange: true };
    }
    return null;
  }

  private futureDateValidator(group: FormGroup) {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (start && end) {
      const isStartValid = start >= tomorrow;
      const isEndValid = end >= tomorrow;
      return isStartValid && isEndValid ? null : { pastDate: true };
    }
    return null;
  }

  calculateTotalPrice() {
    const startDate = this.validateForm.get('startDate')?.value;
    const endDate = this.validateForm.get('endDate')?.value;
    
    if (startDate && endDate && this.ad) {
      if (endDate <= startDate) {
        this.notification.warning('Cảnh báo', 'Ngày kết thúc phải sau ngày bắt đầu');
        this.validateForm.get('endDate')?.setErrors({ dateRange: true });
        this.totalPrice = 0;
        return;
      }

      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 0) {
        this.totalPrice = 0;
        return;
      }

      this.totalPrice = diffDays * this.ad.price;
    } else {
      this.totalPrice = 0;
    }
  }

  getDaysDifference(): number {
    const startDate = this.validateForm.get('startDate')?.value;
    const endDate = this.validateForm.get('endDate')?.value;
    
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  }

  getAdDetailsByAdId() {
    if (!this.adId) {
      this.notification.error('Lỗi', 'Không tìm thấy ID dịch vụ');
      this.router.navigate(['/client/dashboard']);
      return;
    }

    this.isLoading = true;
    this.clientService.getAdDetailsById(this.adId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          if (res && res.adDTO) {
            this.ad = res.adDTO;
            this.avatarUrl = res.adDTO.returnedImg ? 
              'data:image/jpeg;base64,' + res.adDTO.returnedImg : 
              'assets/default-avatar.png';
            this.reviews = res.reviewDTOList || [];
            this.calculateTotalPrice();
          } else {
            this.notification.error('Lỗi', 'Không tìm thấy thông tin dịch vụ');
            this.router.navigate(['/client/dashboard']);
          }
        },
        error: (err) => {
          console.error('Error loading ad details:', err);
          this.notification.error('Lỗi', err.message || 'Không thể tải thông tin dịch vụ');
          this.router.navigate(['/client/dashboard']);
        }
      });
  }

  updateImg(img: string): string {
    return img ? 'data:image/jpeg;base64,' + img : 'assets/default-avatar.png';
  }

  getAverageRating(): number {
    if (!this.reviews || this.reviews.length === 0) {
      return 0;
    }
    const sum = this.reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return Math.round((sum / this.reviews.length) * 10) / 10;
  }

  bookService() {
    if (!UserStorageService.isClientLoggedIn()) {
      this.notification.warning('Thông báo', 'Vui lòng đăng nhập để đặt dịch vụ');
      this.router.navigate(['/login']);
      return;
    }

    if (this.validateForm.invalid) {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    const startDate = this.validateForm.get('startDate')?.value;
    const endDate = this.validateForm.get('endDate')?.value;
    
    if (endDate <= startDate) {
      this.notification.warning('Cảnh báo', 'Ngày kết thúc phải sau ngày bắt đầu');
      return;
    }

    const bookingData = {
      startDate: startDate,
      endDate: endDate,
      message: this.validateForm.get('message')?.value?.trim(),
      adId: this.adId,
      userId: UserStorageService.getUserId(),
      totalPrice: this.totalPrice
    };

    if (this.totalPrice <= 0) {
      this.notification.warning('Cảnh báo', 'Tổng tiền không hợp lệ');
      return;
    }

    this.isBooking = true;
    this.clientService.bookService(bookingData)
      .pipe(finalize(() => this.isBooking = false))
      .subscribe({
        next: (res) => {
          this.notification.success('Thành công', 'Đặt lịch thành công!');
          this.router.navigate(['/payment'], {
            state: { 
              bookingData: bookingData, 
              ad: this.ad 
            }
          });
        },
        error: (err) => {
          console.error('Error booking service:', err);
          this.notification.error(
            'Lỗi',
            err.message || 'Không thể đặt lịch. Vui lòng thử lại sau.'
          );
        }
      });
  }
}
