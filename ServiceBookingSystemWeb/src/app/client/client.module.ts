import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { ClientDashboardComponent } from './pages/client-dashboard/client-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoNgZorroAntdModule } from '../DemoNgZorroAntdModule';
import { AdDetailComponent } from './pages/ad-detail/ad-detail.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { ReviewComponent } from './pages/review/review.component';
import { AllServicesComponent } from './pages/all-services/all-services.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';
import { PaymentComponent } from './pages/payment/payment.component';

@NgModule({
  declarations: [
    ClientComponent,
    ClientDashboardComponent,
    AdDetailComponent,
    MyBookingsComponent,
    ReviewComponent,
    AllServicesComponent,
    ChatbotComponent,
    PaymentComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    FormsModule,
    DemoNgZorroAntdModule,
    ReactiveFormsModule
  ],
  exports: [
    ClientComponent,
    ClientDashboardComponent,
    AdDetailComponent,
    MyBookingsComponent,
    ReviewComponent,
    AllServicesComponent,
    ChatbotComponent,
    PaymentComponent
  ]
})
export class ClientModule { }
