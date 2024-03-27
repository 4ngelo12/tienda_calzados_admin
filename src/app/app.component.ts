import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  display!: ElementRef;

  constructor(private router: Router, private renderer: Renderer2, private el: ElementRef,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.display = this.el.nativeElement.querySelector('#principal');
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const rutaActual = this.router.url;
        (rutaActual.includes("/create")) ? this.setFlex() : this.removeFlex();
      }
    });
  }

  setFlex() {
    if (this.display) {
      this.rechargeComponent();
      this.renderer.addClass(this.display, 'flex');
    }
  }

  removeFlex() {
    if (this.display) {
      this.rechargeComponent();

      this.renderer.removeClass(this.display, 'flex');
    }
  }

  rechargeComponent() {
    this.cdr.detectChanges();
  }
}
