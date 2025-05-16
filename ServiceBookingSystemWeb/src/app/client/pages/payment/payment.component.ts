import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ClientService } from '../../services/client.service';

interface BookingData {
  startDate: string | Date;
  endDate: string | Date;
  message: string;
  adId: number;
  userId: number;
  totalPrice: number;
}

interface AdData {
  serviceName: string;
  price: number;
  companyName: string;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  bookingData: BookingData;
  ad: AdData;
  selectedMethod: string | null = null;

  constructor(
    private router: Router,
    private clientService: ClientService,
    private notification: NzNotificationService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.bookingData = navigation.extras.state['bookingData'];
      this.ad = navigation.extras.state['ad'];
    }
  }

  ngOnInit() {
    if (!this.bookingData || !this.ad) {
      this.notification.error(
        'Lỗi',
        'Không tìm thấy thông tin đặt lịch. Vui lòng thử lại.',
        { nzDuration: 5000 }
      );
      this.router.navigate(['/client/services']);
    }
  }

  goBack() {
    this.router.navigate(['/client/services']);
  }

  payVNPay() {
    if (!this.bookingData) return;

    const orderId = 'HD' + Date.now(); // mã đơn hàng duy nhất
    const amount = this.bookingData.totalPrice; // Sử dụng tổng tiền đã tính

    this.clientService.payVNPay(orderId, amount).subscribe({
      next: (res) => {
        if (res.paymentUrl) {
          this.notification.info(
            'Thông báo',
            'Đang chuyển hướng đến cổng thanh toán VNPay...',
            { nzDuration: 5000 }
          );
          window.location.href = res.paymentUrl; // chuyển sang trang VNPay
        }
      },
      error: (err) => {
        console.error('Lỗi thanh toán:', err);
        this.notification.error(
          'Lỗi',
          'Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.',
          { nzDuration: 5000 }
        );
      }
    });
  }
}

