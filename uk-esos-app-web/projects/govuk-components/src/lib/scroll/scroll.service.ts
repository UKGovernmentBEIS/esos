import { DOCUMENT, Location, ViewportScroller } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Router, Scroll } from '@angular/router';

import { filter } from 'rxjs';

export interface ScrollState {
  scrollSkip: boolean;
}

@Injectable({ providedIn: 'root' })
export class ScrollService {
  constructor(
    private readonly router: Router,
    private readonly viewportScroller: ViewportScroller,
    private readonly location: Location,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
    this.initialize();
  }

  private initialize(): void {
    this.router.events.pipe(filter((event) => event instanceof Scroll)).subscribe((event: Scroll) => {
      const state = this.location.getState() as ScrollState;
      if (!state?.scrollSkip) {
        if (event.position) {
          // backward navigation
          this.viewportScroller.scrollToPosition(event.position);
        } else if (event.anchor) {
          // anchor navigation
          this.focusTargetFragment(event.anchor);
        } else {
          // forward navigation
          this.viewportScroller.scrollToPosition([0, 0]);
        }
      }
    });
  }

  // the last step of the fragment scroll accessibility standard is to
  // `Move the sequential focus navigation starting point to target`
  // https://html.spec.whatwg.org/#scroll-to-fragid
  // Angular fails to do this https://github.com/angular/angular/issues/30067
  // move the sequential focus navigation starting point manually
  private focusTargetFragment(anchor: string) {
    if (!anchor?.startsWith('iss=')) {
      const target = (this.document as HTMLDocument).querySelector<HTMLElement>(`#${anchor}`);
      if (target && target !== this.document.activeElement) {
        const hasTabIndex = target.hasAttribute('tabIndex');
        const initialTabIndex = target.tabIndex;
        if (initialTabIndex !== 0) {
          target.tabIndex = 0;
        }
        target.focus({ preventScroll: true });
        this.viewportScroller.scrollToAnchor(anchor);
        if (!hasTabIndex) {
          target.removeAttribute('tabIndex');
        } else if (target.tabIndex !== initialTabIndex) {
          target.tabIndex = initialTabIndex;
        }
      }
    }
  }
}
