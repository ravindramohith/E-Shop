import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BannerComponent } from './banner/banner.component';
import { SliderComponent } from './slider/slider.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [
    BannerComponent,
    SliderComponent
  ],
  exports: [
    BannerComponent,
    SliderComponent
  ],
})
export class UiModule {}