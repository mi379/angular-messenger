import { trigger,state,style,animate,transition } from '@angular/animations';

const hideContent = style({filter:'blur(12px)'})
const showContent = style({filter:'blur(0px)'})

const hide = state('hide',hideContent)
const show = state('show',showContent)

export const blurAnimation = trigger(
  'blurAnimation',[hide,show]
)

