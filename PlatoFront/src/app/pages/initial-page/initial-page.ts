import {Component} from '@angular/core';
import {BtnOrange} from '../../components/btn-orange/btn-orange';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-initial-page',
  imports: [
    BtnOrange,
    RouterLink
  ],
  templateUrl: './initial-page.html',
  styleUrl: './initial-page.scss',
})
export class InitialPage {

}
