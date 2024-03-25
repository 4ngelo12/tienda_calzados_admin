import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/core/services/products.service';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {

  constructor(private productService: ProductsService) { }

  ngOnInit(): void {
  }

}
