import {
  Component, OnInit, OnDestroy,
  HostListener, ViewChildren, QueryList, ElementRef
} from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgFor],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  links = [
    { label: 'Home',       href: '#home',       id: 'home',       icon: '⌂' },
    { label: 'About',      href: '#about',      id: 'about',      icon: '◉' },
    { label: 'Skills',     href: '#skills',     id: 'skills',     icon: '⚡' },
    { label: 'Projects',   href: '#projects',   id: 'projects',   icon: '◈' },
    { label: 'Experience', href: '#experience', id: 'experience', icon: '◎' },
    { label: 'Contact',    href: '#contact',    id: 'contact',    icon: '◌' },
  ];

  isScrolled     = false;
  isMenuOpen     = false;
  activeSection  = 'home';
  scrollProgress = 0;
  magnetStyle    = 'translate(0px, 0px)';

  pillLeft    = 0;
  pillWidth   = 0;
  pillVisible = false;

  @ViewChildren('navLinkEl') navLinkEls!: QueryList<ElementRef<HTMLAnchorElement>>;

  private observer!: IntersectionObserver;

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.isScrolled     = scrollTop > 40;
    this.scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (this.isMenuOpen) this.closeMenu();
  }

  ngOnInit(): void {
    this.initObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) this.observer.disconnect();
  }

  private initObserver(): void {
    this.observer = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            this.activeSection = e.target.id;
            this.updatePill();
          }
        }
      },
      { threshold: 0.35 }
    );
    this.links.forEach(l => {
      const el = document.getElementById(l.id);
      if (el) this.observer.observe(el);
    });
  }

  private updatePill(): void {
    setTimeout(() => {
      const els = this.navLinkEls?.toArray() ?? [];
      const idx = this.links.findIndex(l => l.id === this.activeSection);
      if (idx < 0 || !els[idx]) return;
      const el   = els[idx].nativeElement;
      const rect = el.getBoundingClientRect();
      const parent = el.closest('.nav-track') as HTMLElement;
      const parentRect = parent?.getBoundingClientRect();
      if (!parentRect) return;
      this.pillLeft    = rect.left - parentRect.left;
      this.pillWidth   = rect.width;
      this.pillVisible = true;
    }, 50);
  }

  onLinkHover(e: MouseEvent): void {
    const el         = e.currentTarget as HTMLElement;
    const rect       = el.getBoundingClientRect();
    const parent     = el.closest('.nav-track') as HTMLElement;
    const parentRect = parent?.getBoundingClientRect();
    if (!parentRect) return;
    this.pillLeft    = rect.left - parentRect.left;
    this.pillWidth   = rect.width;
    this.pillVisible = true;
  }

  onLinkLeave(): void {
    this.updatePill();
  }

  setActive(id: string): void {
    this.activeSection = id;
    this.updatePill();
    this.closeMenu();
  }

  toggleMenu(): void { this.isMenuOpen = !this.isMenuOpen; }
  closeMenu(): void  { this.isMenuOpen = false; }

  onMagnet(e: MouseEvent): void {
    const el   = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const px   = (e.clientX - rect.left) / rect.width  - 0.5;
    const py   = (e.clientY - rect.top)  / rect.height - 0.5;
    this.magnetStyle = `translate(${px * 12}px, ${py * 8}px)`;
  }

  offMagnet(): void { this.magnetStyle = 'translate(0px, 0px)'; }
}