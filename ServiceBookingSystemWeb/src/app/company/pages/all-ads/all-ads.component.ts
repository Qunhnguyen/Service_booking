import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-all-ads',
  templateUrl: './all-ads.component.html',
  styleUrls: ['./all-ads.component.scss']
})
export class AllAdsComponent implements OnInit {
  ads: any[] = [];
  filteredAds: any[] = [];
  searchText: string = '';
  isLoading: boolean = false;

  constructor(
    private companyService: CompanyService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAds();
  }

  loadAds() {
    this.isLoading = true;
    this.companyService.getAllAdsByUserId()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (res) => {
          this.ads = res;
          this.filteredAds = res;
        },
        error: (error) => {
          console.error('Error loading ads:', error);
          this.showNotification('Không thể tải danh sách dịch vụ', 'error');
        }
      });
  }

  onSearch(value: string) {
    this.searchText = value;
    if (!value) {
      this.filteredAds = this.ads;
      return;
    }
    
    const searchValue = value.toLowerCase();
    this.filteredAds = this.ads.filter(ad => 
      ad.serviceName?.toLowerCase().includes(searchValue) ||
      ad.description?.toLowerCase().includes(searchValue)
    );
  }

  deleteAd(adId: number) {
    this.isLoading = true;
    this.companyService.deleteAd(adId)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: () => {
          this.showNotification('Xóa dịch vụ thành công', 'success');
          this.loadAds();
        },
        error: (error) => {
          console.error('Error deleting ad:', error);
          this.showNotification('Không thể xóa dịch vụ', 'error');
        }
      });
  }

  updateImg(img: string): string {
    return 'data:image/jpeg;base64,' + img;
  }

  private showNotification(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Đóng', {
      duration: 5000,
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
    });
  }

  sortByPriceAsc() {
    this.filteredAds.sort((a, b) => a.price - b.price);
  }

  sortByPriceDesc() {
    this.filteredAds.sort((a, b) => b.price - a.price);
  }

  filterByPrice(range: 'low' | 'medium' | 'high') {
    switch (range) {
      case 'low':
        this.filteredAds = this.ads.filter(ad => ad.price < 100000);
        break;
      case 'medium':
        this.filteredAds = this.ads.filter(ad => ad.price >= 100000 && ad.price <= 300000);
        break;
      case 'high':
        this.filteredAds = this.ads.filter(ad => ad.price > 300000);
        break;
    }
  }
}
