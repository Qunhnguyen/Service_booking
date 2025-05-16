import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CustomPriceDialogComponent } from '../../components/custom-price-dialog/custom-price-dialog.component';
import { PremiumPriceDialogComponent } from '../../components/premium-price-dialog/premium-price-dialog.component';
import { finalize, takeUntil } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserStorageService } from '../../../basic/services/storage/user-storage.service';
import { Subject } from 'rxjs';

export interface Booking {
  id: number;
  userName: string;
  serviceName: string;
  message: string;
  reservationStatus: string;
  price: number;
  startDate: Date;
  endDate: Date;
}

@Component({
  selector: 'app-company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.scss']
})
export class CompanyDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  bookings: Booking[] = [];
  dataSource = new MatTableDataSource<Booking>([]);
  searchText: string = '';
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();

  displayedColumns: string[] = [
    'userName',
    'serviceName',
    'message',
    'startDate',
    'endDate',
    'price',
    'status',
    'actions'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private companyService: CompanyService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    if (!UserStorageService.isCompanyLoggedIn()) {
      this.showNotification('Vui lòng đăng nhập để tiếp tục', 'error');
      this.router.navigate(['/login']);
      return;
    }
    this.setupDataSource();
    this.loadBookings();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupDataSource() {
    this.dataSource.filterPredicate = (data: Booking, filter: string) => {
      const searchStr = filter.toLowerCase();
      return (
        data.userName?.toLowerCase().includes(searchStr) ||
        data.serviceName?.toLowerCase().includes(searchStr) ||
        data.message?.toLowerCase().includes(searchStr)
      );
    };
  }

  loadBookings() {
    this.isLoading = true;
    this.companyService.getAllAdBooking()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (res) => {
          if (Array.isArray(res)) {
            this.bookings = res;
            this.dataSource.data = res;
          } else {
            this.showNotification('Dữ liệu không hợp lệ', 'error');
          }
        },
        error: (error) => {
          console.error('Error loading bookings:', error);
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
          this.showNotification(
            error.message || 'Không thể tải danh sách đặt lịch',
            'error'
          );
        }
      });
  }

  onSearch(event: string) {
    this.dataSource.filter = event.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getConfirmedBookings(): number {
    return this.bookings.filter(booking => 
      booking.reservationStatus === 'APPROVED'
    ).length;
  }

  getPendingBookings(): number {
    return this.bookings.filter(booking => 
      booking.reservationStatus === 'PENDING'
    ).length;
  }

  getStatusColor(status: string): string {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'primary';
      case 'PENDING':
        return 'accent';
      case 'REJECTED':
        return 'warn';
      default:
        return 'default';
    }
  }

  confirmStatusChange(bookingId: number, status: string) {
    if (!bookingId || !status) {
      this.showNotification('Thông tin không hợp lệ', 'error');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Xác nhận thay đổi trạng thái',
        message: `Bạn có chắc chắn muốn thay đổi trạng thái sang "${status}"?`,
        confirmText: 'Xác nhận',
        cancelText: 'Hủy',
        isDanger: status === 'REJECTED'
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.changeBookingStatus(bookingId, status);
        }
      });
  }

  confirmDelete(bookingId: number) {
    if (!bookingId) {
      this.showNotification('ID đặt lịch không hợp lệ', 'error');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Xác nhận xóa',
        message: 'Bạn có chắc chắn muốn xóa đặt lịch này?',
        confirmText: 'Xóa',
        cancelText: 'Hủy',
        isDanger: true
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.deleteBooking(bookingId);
        }
      });
  }

  changeBookingStatus(bookingId: number, status: string) {
    if (!bookingId || !status) {
      this.showNotification('Thông tin không hợp lệ', 'error');
      return;
    }

    this.isLoading = true;
    this.companyService.changeBookingStatus(bookingId, status)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: () => {
          this.showNotification('Cập nhật trạng thái thành công', 'success');
          this.loadBookings();
        },
        error: (error) => {
          console.error('Error changing status:', error);
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
          this.showNotification(
            error.message || 'Không thể cập nhật trạng thái',
            'error'
          );
        }
      });
  }

  deleteBooking(bookingId: number) {
    if (!bookingId) {
      this.showNotification('ID đặt lịch không hợp lệ', 'error');
      return;
    }

    this.isLoading = true;
    this.companyService.deleteService(bookingId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: () => {
          this.showNotification('Xóa đặt lịch thành công', 'success');
          this.loadBookings();
        },
        error: (error) => {
          console.error('Error deleting booking:', error);
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
          this.showNotification(
            error.message || 'Không thể xóa đặt lịch',
            'error'
          );
        }
      });
  }

  openCustomPriceDialog(booking: Booking) {
    if (!booking || !booking.id) {
      this.showNotification('Thông tin đặt lịch không hợp lệ', 'error');
      return;
    }

    const dialogRef = this.dialog.open(CustomPriceDialogComponent, {
      width: '400px',
      data: {
        currentPrice: booking.price || 0
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result !== undefined) {
          this.updateBookingPrice(booking.id, result);
        }
      });
  }

  openPremiumPriceDialog(booking: Booking) {
    if (!booking || !booking.id) {
      this.showNotification('Thông tin đặt lịch không hợp lệ', 'error');
      return;
    }

    const dialogRef = this.dialog.open(PremiumPriceDialogComponent, {
      width: '400px',
      data: {
        currentPrice: booking.price || 0
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result !== undefined) {
          this.updateBookingPrice(booking.id, result);
        }
      });
  }

  updateBookingPrice(bookingId: number, price: number) {
    if (!bookingId || price < 0) {
      this.showNotification('Thông tin giá không hợp lệ', 'error');
      return;
    }

    this.isLoading = true;
    this.companyService.updateBookingPrice(bookingId, price)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: () => {
          this.showNotification('Cập nhật giá thành công', 'success');
          this.loadBookings();
        },
        error: (error) => {
          console.error('Error updating price:', error);
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
          this.showNotification(
            error.message || 'Không thể cập nhật giá',
            'error'
          );
        }
      });
  }

  private showNotification(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Đóng', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }
}
