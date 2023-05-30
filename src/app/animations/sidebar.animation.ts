import { trigger,state,style,animate,transition } from '@angular/animations';

const animation  = transition('show <=> hide',[animate('0.3s')])

const toHideConfig = style({transform:`translate3d(-100%,0,0)`})

const toShowConfig = style({transform:`translate3d(0,0,0)`})

const show = state('show',toShowConfig)
const hide = state('hide',toHideConfig)

export const sidebarAnimation = trigger(
  'sidebarState',[
    show,
    hide,
    animation
  ]
)