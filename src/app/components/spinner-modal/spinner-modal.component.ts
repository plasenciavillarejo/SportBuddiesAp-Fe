import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-spinner-modal',
  standalone: true,
  imports: [],
  templateUrl: './spinner-modal.component.html'
})
export class SpinnerModalComponent implements OnInit{

  @Input() pagoTarjeta : boolean = false;
  @Input() pagoPaypal: boolean = false;
  @Input() cancelarPago: boolean = false;


  constructor(private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ){}
  
  ngOnInit(): void {
    // Se le indica a Angular que verifique inmediatamente si hubo cambios en las propiedades o variables vinculadas al HTML del componente.
    this.cdRef.detectChanges();
  }

}
