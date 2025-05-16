import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-update-ad',
  templateUrl: './update-ad.component.html',
  styleUrls: ['./update-ad.component.scss']
})
export class UpdateAdComponent implements OnInit {
  validateForm!: FormGroup;
  imagePreview: string | null = null;
  existingImage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      serviceName: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.min(0)]],
      description: [null, [Validators.required]]
    });

    const adId = this.route.snapshot.params['id'];
    if (adId) {
      this.loadAdDetails(adId);
    }
  }

  loadAdDetails(adId: number) {
    this.isLoading = true;
    this.companyService.getAdById(adId)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (res) => {
          this.validateForm.patchValue({
            serviceName: res.serviceName,
            price: res.price,
            description: res.description
          });
          this.existingImage = res.returnedImg;
        },
        error: (error) => {
          console.error('Error loading ad details:', error);
          this.showNotification('Không thể tải thông tin dịch vụ', 'error');
        }
      });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  updateAd() {
    if (this.validateForm.valid) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('serviceName', this.validateForm.get('serviceName')?.value);
      formData.append('price', this.validateForm.get('price')?.value);
      formData.append('description', this.validateForm.get('description')?.value);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append('file', fileInput.files[0]);
      }

      const adId = this.route.snapshot.params['id'];
      this.companyService.updateAd(adId, formData)
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: () => {
            this.showNotification('Cập nhật dịch vụ thành công', 'success');
            this.router.navigate(['/company/all-ads']);
          },
          error: (error) => {
            console.error('Error updating ad:', error);
            this.showNotification('Không thể cập nhật dịch vụ', 'error');
          }
        });
    } else {
      this.validateForm.markAllAsTouched();
    }
  }

  private showNotification(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Đóng', {
      duration: 5000,
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
    });
  }
}
