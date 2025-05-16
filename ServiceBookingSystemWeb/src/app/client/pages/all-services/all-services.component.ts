import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-all-services',
  templateUrl: './all-services.component.html',
  styleUrls: ['./all-services.component.scss']
})
export class AllServicesComponent implements OnInit, OnDestroy {
  ads: any[] = [];        // Dịch vụ hiển thị
  allAds: any[] = [];     // Dịch vụ gốc (từ backend)
  searchQuery: string = '';
  selectedCategory: string = '';
  categories: string[] = [];
  sortType: string = '';
  priceRange: string = '';
  minRating: number = 0;
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private clientService: ClientService,
    private notification: NzNotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.loadAllAds();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAllAds(): void {
    this.isLoading = true;
    this.clientService.getAllAds()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any[]) => {
          if (res && Array.isArray(res)) {
            // Lấy thông tin chi tiết cho từng dịch vụ
            res.forEach((ad, index) => {
              this.clientService.getAdDetailsById(ad.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                  next: (details) => {
                    if (details && details.adDTO) {
                      const reviews = details.reviewDTOList || [];
                      const rating = this.calculateAverageRating(reviews);
                      this.allAds[index] = {
                        ...ad,
                        rating: rating,
                        price: Number(ad.price) || 0,
                        serviceName: ad.serviceName || 'Chưa có tên dịch vụ',
                        companyName: ad.companyName || 'Chưa có tên công ty'
                      };
                      this.applyFilters();
                    }
                  },
                  error: (err) => {
                    console.error('Lỗi lấy chi tiết dịch vụ:', err);
                  }
                });
            });
            this.allAds = res;
            this.applyFilters();
          } else {
            this.notification.warning(
              'Cảnh báo',
              'Dữ liệu trả về không đúng định dạng',
              { nzDuration: 5000 }
            );
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Lỗi getAllAds:', err);
          if (err.status === 401) {
            this.notification.error(
              'Lỗi xác thực',
              'Vui lòng đăng nhập lại để tiếp tục',
              { nzDuration: 5000 }
            );
            this.router.navigate(['/login']);
          } else {
            this.notification.error(
              'Lỗi',
              err.message || 'Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.',
              { nzDuration: 5000 }
            );
          }
          this.isLoading = false;
        }
      });
  }

  calculateAverageRating(reviews: any[]): number {
    if (!reviews || reviews.length === 0) {
      return 0;
    }
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }

  getCategories(): void {
    this.clientService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any[]) => {
          if (res && Array.isArray(res)) {
            this.categories = res;
          }
        },
        error: (err) => {
          console.error('Lỗi lấy danh mục:', err);
          this.notification.error(
            'Lỗi',
            err.message || 'Không thể tải danh mục. Vui lòng thử lại sau.',
            { nzDuration: 5000 }
          );
        }
      });
  }

  applyFilters(): void {
    try {
      let filtered = [...this.allAds];

      // Lọc theo từ khóa
      if (this.searchQuery.trim() !== '') {
        const keyword = this.searchQuery.toLowerCase();
        filtered = filtered.filter(ad =>
          ad.serviceName?.toLowerCase().includes(keyword) ||
          ad.companyName?.toLowerCase().includes(keyword)
        );
      }

      // Lọc theo giá
      if (this.priceRange === '<100') {
        filtered = filtered.filter(ad => (ad.price || 0) < 100000);
      } else if (this.priceRange === '100-300') {
        filtered = filtered.filter(ad => (ad.price || 0) >= 100000 && (ad.price || 0) <= 300000);
      } else if (this.priceRange === '>300') {
        filtered = filtered.filter(ad => (ad.price || 0) > 300000);
      }

      // Lọc theo đánh giá
      if (this.minRating > 0) {
        filtered = filtered.filter(ad => (ad.rating || 0) >= this.minRating);
      }

      // Sắp xếp theo giá
      if (this.sortType === 'asc') {
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
      } else if (this.sortType === 'desc') {
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
      }

      this.ads = filtered;
    } catch (error) {
      console.error('Lỗi khi áp dụng bộ lọc:', error);
      this.notification.error(
        'Lỗi',
        'Có lỗi xảy ra khi lọc dữ liệu. Vui lòng thử lại.',
        { nzDuration: 5000 }
      );
    }
  }

  onSearch(): void {
    this.applyFilters();
  }

  onSelectCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  updateImg(img: string): string {
    if (!img) return 'assets/default-image.jpg';
    return 'data:image/jpeg;base64,' + img;
  }

  sortByPrice(type: string): void {
    this.sortType = type;
    this.applyFilters();
  }

  filterByPrice(range: string): void {
    this.priceRange = range;
    this.applyFilters();
  }

  filterByRating(rating: number): void {
    this.minRating = rating;
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.sortType = '';
    this.priceRange = '';
    this.minRating = 0;
    this.applyFilters();
  }
}
