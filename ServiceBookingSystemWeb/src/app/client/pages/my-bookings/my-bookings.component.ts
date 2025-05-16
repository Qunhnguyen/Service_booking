import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss']
})
export class MyBookingsComponent implements OnInit {
  bookedServices: any[] = [];
  filteredBookings: any[] = [];
  pendingBookings: number = 0;
  confirmedBookings: number = 0;
  completedBookings: number = 0;
  totalReviews: number = 0;
  statusFilter: string = 'all';
  timeFilter: string = 'all';
  isLoading: boolean = false;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading = true;
    this.clientService.getMyBookings().subscribe(
      (response: any) => {
        this.bookedServices = response;
        this.filteredBookings = [...this.bookedServices];
        this.updateStatistics();
        this.applyFilters();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading bookings:', error);
        this.notification.error(
          'Lỗi',
          'Không thể tải danh sách đặt lịch. Vui lòng thử lại sau.',
          { nzDuration: 5000 }
        );
        this.isLoading = false;
      }
    );
  }

  updateStatistics() {
    this.pendingBookings = this.bookedServices.filter(booking => 
      booking.reservationStatus === 'PENDING'
    ).length;

    this.confirmedBookings = this.bookedServices.filter(booking => 
      booking.reservationStatus === 'CONFIRMED'
    ).length;

    this.completedBookings = this.bookedServices.filter(booking => 
      booking.reservationStatus === 'COMPLETED'
    ).length;

    this.totalReviews = this.bookedServices.filter(booking => 
      booking.reviewStatus === 'TRUE'
    ).length;
  }

  filterByStatus(status: string) {
    this.statusFilter = status;
    this.applyFilters();
  }

  filterByTime(time: string) {
    this.timeFilter = time;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.bookedServices];

    // Filter by status
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(booking => 
        booking.reservationStatus === this.statusFilter.toUpperCase()
      );
    }

    // Filter by time
    if (this.timeFilter !== 'all') {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.bookDate);
        switch (this.timeFilter) {
          case 'week':
            return bookingDate >= weekAgo;
          case 'month':
            return bookingDate >= monthAgo;
          case 'quarter':
            return bookingDate >= quarterAgo;
          default:
            return true;
        }
      });
    }

    this.filteredBookings = filtered;
  }

  deleteBooking(bookingId: string) {
    if (confirm('Bạn có chắc chắn muốn hủy đặt lịch này?')) {
      this.isLoading = true;
      this.clientService.deleteService(bookingId).subscribe(
        () => {
          this.bookedServices = this.bookedServices.filter(booking => booking.id !== bookingId);
          this.updateStatistics();
          this.applyFilters();
          this.notification.success(
            'Thành công',
            'Đã hủy đặt lịch thành công',
            { nzDuration: 5000 }
          );
          this.isLoading = false;
        },
        (error) => {
          console.error('Error deleting booking:', error);
          this.notification.error(
            'Lỗi',
            'Không thể hủy đặt lịch. Vui lòng thử lại sau.',
            { nzDuration: 5000 }
          );
          this.isLoading = false;
        }
      );
    }
  }
}
