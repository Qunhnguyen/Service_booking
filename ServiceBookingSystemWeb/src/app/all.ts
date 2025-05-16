import { Component } from '@angular/core';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CompanyService } from './company/services/company.service';

@Component({
  selector: 'app-all-ads',
  templateUrl: './all-ads.component.html',
  styleUrls: ['./all-ads.component.scss']
})
export class AllAdsComponent {

  ads:any;
  constructor(private companyService:CompanyService,
    private notification: NzNotificationService,
    ){}


  ngOnInit(){
    this.getAllAdsByUserId();
  }

  getAllAdsByUserId(){
    this.companyService.getAllAdsByUserId().subscribe(res=>{
      this.ads=res;
    })
  }

  updateImg(img){
    return 'data:image/jpeg;base64,' + img ;
  }

  deleteAd(adId:any){
    this.companyService.deleteAd(adId).subscribe(res=>{
      this.notification
      .success(
        "SUCCESS",
        "Ad Deleted Successfully",
        {nzDuration:5000}
      );
      this.getAllAdsByUserId();
    })
  }
}
import { Component } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-ad',
  templateUrl: './update-ad.component.html',
  styleUrls: ['./update-ad.component.scss']
})
export class UpdateAdComponent {


  adID:any=this.activatedroute.snapshot.params['id'];

  selectedFile:File | null;
  imagePreview:string | ArrayBuffer | null;
  validateForm!:FormGroup;
  existingImage:string|null=null;

  imgChanged=false;

  constructor(private fb:FormBuilder,
    private notification:NzNotificationService,
    private router:Router,
    private companyService:CompanyService,
    private activatedroute:ActivatedRoute
    ){}

    ngOnInit(){
      this.validateForm=this.fb.group({
        serviceName:[null,[Validators.required]],
        description:[null,[Validators.required]],
        price:[null,[Validators.required]]

      })
      this.getAdById();
    }

    onFileSelected(event:any){
      this.selectedFile=event.target.files[0];
      this.previewImage();
      this.existingImage=null;
      this.imgChanged=true;
    }

    previewImage(){
      const reader=new FileReader()
      reader.onload=()=>{
        this.imagePreview=reader.result;
      }
      reader.readAsDataURL(this.selectedFile);
    }

    updateAd(){
      const formData:FormData=new FormData();

      if(this.imgChanged && this.selectedFile){
        formData.append('img',this.selectedFile);
      }


      formData.append('serviceName',this.validateForm.get('serviceName').value);
      formData.append('description',this.validateForm.get('description').value);
      formData.append('price',this.validateForm.get('price').value);

      this.companyService.updateAd(this.adID,formData).subscribe(res=>{
        this.notification
        .success(
          'SUCCESS',
          'Ad Updated Successfully',
          {nzDuration:5000}
        );
        this.router.navigateByUrl('/company/ads');
      },error =>{
        this.notification
        .error(
          'ERROR',
          `${error.error}`,
          {nzDuration:5000}
        );
      })
    }



  getAdById(){
    this.companyService.getAdById(this.adID).subscribe(res=>{
      console.log(res);
      this.validateForm.patchValue(res);
      this.existingImage='data:image/jpeg;base64,'+ res.returnedImg;
    })
  }


}
import { Component } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.scss']
})
export class CompanyDashboardComponent {
  constructor(private companyService:CompanyService,private notification:NzNotificationService){}

  bookings:any;

  ngOnInit(){
    this.getAllAdBookings();
  }

  getAllAdBookings(){
    this.companyService.getAllAdBooking().subscribe(res=>{
      console.log(res);
      this.bookings=res
    })
  }

  changeBookingStatus(bookingId:number,status:string){
    this.companyService.changeBookingStatus(bookingId,status).subscribe(res=>{
      this.notification
        .success(
          'SUCCESS',
          'Booking status changed Successfully',
          {nzDuration:5000}
        );
        this.getAllAdBookings();

      },error =>{
        this.notification
        .error(
          'ERROR',
          `${error.error}`,
          {nzDuration:5000}
        );
      })
  }
  deleteBooking(bookingId: number) {
    this.companyService.deleteService(bookingId).subscribe(res=>{
      this.notification
      .success(
        'SUCCESS',
        'Review posted successfully',
        {nzDuration:5000}
      );
      this.getAllAdBookings();
    },error=>{
      this.notification
      .error(
        'ERROR',
        `${error.message}`,
        {nzDuration:5000}
      );
    });
  }

}
