// import { Component } from '@angular/core';
// import { CompanyService } from '../../services/company.service';
// import { ActivatedRoute, Router } from '@angular/router';
// import { NzNotificationService } from 'ng-zorro-antd/notification';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//
// @Component({
//   selector: 'app-update-ad',
//   templateUrl: './update-ad.component.html',
//   styleUrls: ['./update-ad.component.scss']
// })
// export class UpdateAdComponent {
//
//   adID = this.activatedroute.snapshot.params['id'];
//   selectedFile: File | null = null;
//   imagePreview: string | ArrayBuffer | null = null;
//   validateForm!: FormGroup;
//   existingImage: string | null = null;
//   imgChanged = false;
//
//   constructor(
//     private fb: FormBuilder,
//     private notification: NzNotificationService,
//     private router: Router,
//     private companyService: CompanyService,
//     private activatedroute: ActivatedRoute
//   ) {}
//
//   ngOnInit() {
//     this.validateForm = this.fb.group({
//       serviceName: [null, [Validators.required]],
//       description: [null, [Validators.required]],
//       price: [null, [Validators.required]]
//     });
//     this.getAdById();
//   }
//
//   onFileSelected(event: any) {
//     this.selectedFile = event.target.files[0];
//     this.previewImage();
//     this.existingImage = null;
//     this.imgChanged = true;
//   }
//
//   previewImage() {
//     const reader = new FileReader();
//     reader.onload = () => {
//       this.imagePreview = reader.result;
//     };
//     if (this.selectedFile) {
//       reader.readAsDataURL(this.selectedFile);
//     }
//   }
//
//   updateAd() {
//     const formData = new FormData();
//     if (this.imgChanged && this.selectedFile) {
//       formData.append('img', this.selectedFile);
//     }
//     formData.append('serviceName', this.validateForm.get('serviceName')?.value);
//     formData.append('description', this.validateForm.get('description')?.value);
//     formData.append('price', this.validateForm.get('price')?.value);
//
//     this.companyService.updateAd(this.adID, formData).subscribe(res => {
//       this.notification.success('SUCCESS', 'Ad Updated Successfully', { nzDuration: 5000 });
//       this.router.navigateByUrl('/company/ads');
//     }, error => {
//       this.notification.error('ERROR', `${error.error}`, { nzDuration: 5000 });
//     });
//   }
//
//   getAdById() {
//     this.companyService.getAdById(this.adID).subscribe(res => {
//       this.validateForm.patchValue(res);
//       this.existingImage = 'data:image/jpeg;base64,' + res.returnedImg;
//     });
//   }
// }
