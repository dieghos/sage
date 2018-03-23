import {ToastOptions} from 'ng2-toastr';

export class CustomOption extends ToastOptions {
  animate = 'flyRight'; 
  newestOnTop = false;
  showCloseButton = true;
  positionClass = 'toast-bottom-right';
}
