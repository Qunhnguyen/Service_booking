import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserStorageService } from '../basic/services/storage/user-storage.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent {
  isCollapsed = false;
  companyName = 'Anh quan Service';
  showDropdown = false;

  constructor(private router: Router) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    UserStorageService.signout();
    this.router.navigateByUrl('/login');
  }
}
