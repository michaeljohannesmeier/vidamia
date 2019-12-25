import { Component, OnInit, isDevMode } from '@angular/core';
import { StateService } from '../../services/state.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  products: any[] = [];
  urlPrefix = '';
  mainPictureUrls = [];
  mainPictureUrl: string;
  counterSlider = 0;
  allKeys = [];
  offers = false;
  constructor(private stateService: StateService,
              private apiService: ApiService) { }

  ngOnInit() {
    this.stateService.loading$.next(true);
    if (isDevMode()) {
      this.urlPrefix = 'http://localhost:1337';
    }
    this.apiService.getProducts();
    this.stateService.products$.subscribe(products => {
        this.products = products;
        this.products.forEach(product => {
          if (product.offer) {
            this.offers = true;
          }
        });
    });
    this.stateService.mainPictures$.subscribe(pictureUrls => {
      this.mainPictureUrls = pictureUrls;
      this.mainPictureUrl = this.mainPictureUrls[this.counterSlider];
    });

    setInterval( () => {
      if (this.counterSlider === this.mainPictureUrls.length - 1) {
        this.counterSlider = 0;
      } else {
        this.counterSlider += 1;
      }
      this.mainPictureUrl = this.mainPictureUrls[this.counterSlider];

    }, 4000);

    this.stateService.loading$.next(false);
  }

}
