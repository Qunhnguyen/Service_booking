import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserStorageService } from 'src/app/basic/services/storage/user-storage.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ✅ Lấy quảng cáo mới nhất (PUBLIC)
  getLatestAds(): Observable<any> {
    return this.http.get(`${this.apiUrl}api/client/latest-ads`).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Lấy tất cả dịch vụ
  getAllAds(): Observable<any> {
    return this.http.get(this.apiUrl + 'api/client/ads', {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Tìm kiếm theo từ khoá + danh mục
  searchAdsAndCategory(search?: string, category?: string): Observable<any> {
    let params: any = {};
    if (search) params.search = search;
    if (category) params.category = category;

    return this.http.get(this.apiUrl + 'api/client/ads', {
      params: params,
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Lấy danh sách danh mục (PUBLIC)
  getCategories(): Observable<any> {
    return this.http.get(this.apiUrl + 'api/client/categories').pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Lấy top quảng cáo (PUBLIC)
  getTop8AdsByReservationCount(): Observable<any> {
    return this.http.get(this.apiUrl + 'api/client/top-ads').pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Tìm kiếm quảng cáo theo tên
  searchAdByName(name: string): Observable<any> {
    if (!name) {
      return throwError(() => new Error('Tên tìm kiếm không được để trống'));
    }
    return this.http.get(this.apiUrl + `api/client/search/${name}`, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Lấy chi tiết quảng cáo
  getAdDetailsById(adId: string | number): Observable<any> {
    if (!adId) {
      return throwError(() => new Error('ID quảng cáo không hợp lệ'));
    }
    return this.http.get(this.apiUrl + `api/client/ad/${adId}`, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Lấy danh sách đặt chỗ của user
  getMyBookings(): Observable<any> {
    const userId = UserStorageService.getUserId();
    if (!userId) {
      return throwError(() => new Error('Vui lòng đăng nhập để xem đặt chỗ'));
    }
    return this.http.get(this.apiUrl + `api/client/my-bookings/${userId}`, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Đặt dịch vụ
  bookService(bookDTO: any): Observable<any> {
    if (!bookDTO) {
      return throwError(() => new Error('Thông tin đặt chỗ không hợp lệ'));
    }
    return this.http.post(this.apiUrl + 'api/client/book-service', bookDTO, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Hủy đặt chỗ
  deleteService(bookingId: string): Observable<any> {
    if (!bookingId) {
      return throwError(() => new Error('ID đặt chỗ không hợp lệ'));
    }
    return this.http.delete(this.apiUrl + `api/client/my-bookings/${bookingId}`, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Gửi đánh giá
  giveReview(reviewDTO: any): Observable<any> {
    if (!reviewDTO) {
      return throwError(() => new Error('Thông tin đánh giá không hợp lệ'));
    }
    return this.http.post(this.apiUrl + 'api/client/review', reviewDTO, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Lấy đánh giá của dịch vụ
  getServiceReviews(serviceId: string): Observable<any> {
    if (!serviceId) {
      return throwError(() => new Error('ID dịch vụ không hợp lệ'));
    }
    return this.http.get(this.apiUrl + `api/client/reviews/${serviceId}`, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      map(reviews => {
        if (Array.isArray(reviews)) {
          return reviews.map(review => ({
            ...review,
            rating: Number(review.rating) || 0
          }));
        }
        return [];
      }),
      catchError(this.handleError)
    );
  }

  // Lấy rating của dịch vụ
  getServiceRating(serviceId: string): Observable<any> {
    if (!serviceId) {
      return throwError(() => new Error('ID dịch vụ không hợp lệ'));
    }
    return this.http.get(this.apiUrl + `api/client/ads/${serviceId}/rating`, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      map((res: any) => ({
        rating: Number(res.rating) || 0,
        totalReviews: Number(res.totalReviews) || 0
      })),
      catchError(this.handleError)
    );
  }

  // ✅ Thanh toán
  payVNPay(orderId: string, amount: number): Observable<any> {
    if (!orderId || amount <= 0) {
      return throwError(() => new Error('Thông tin thanh toán không hợp lệ'));
    }
    return this.http.post(this.apiUrl + 'api/payment/create', {
      orderId,
      amount
    }, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Tạo header Authorization
  private createAuthorizationHeader(): HttpHeaders {
    const token = UserStorageService.getToken();
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }
    return headers;
  }

  // Xử lý lỗi
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
    
    if (error.error instanceof ErrorEvent) {
      // Lỗi client-side
      errorMessage = error.error.message;
    } else {
      // Lỗi server-side
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Yêu cầu không hợp lệ';
          break;
        case 401:
          errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
          break;
        case 403:
          errorMessage = 'Bạn không có quyền thực hiện thao tác này.';
          break;
        case 404:
          errorMessage = 'Không tìm thấy dữ liệu yêu cầu.';
          break;
        case 500:
          errorMessage = 'Lỗi hệ thống. Vui lòng thử lại sau.';
          break;
        default:
          errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
