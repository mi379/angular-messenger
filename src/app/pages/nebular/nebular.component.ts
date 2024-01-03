import { ChangeDetectionStrategy,Component } from '@angular/core';
import { NbLayoutModule,NbButtonComponent, NbButtonModule } from '@nebular/theme';


@Component({
  selector: 'app-nebular',
  standalone:true,
  templateUrl: './nebular.component.html',
  styleUrl: './nebular.component.css',
  imports: [NbLayoutModule,NbButtonModule]
})
export class NebularComponent {

}
