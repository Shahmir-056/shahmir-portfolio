import {
  Component, OnInit, AfterViewInit, OnDestroy,
  ViewChild, ElementRef, HostBinding, NgZone
} from '@angular/core';

type MKey = 'primary' | 'outline' | 'mail';

interface Dot {
  x: number; y: number;
  vx: number; vy: number;
  r: number; a: number;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss']
})
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('networkCanvas') cvRef!: ElementRef<HTMLCanvasElement>;

  titles = [
    'Full-Stack Developer',
    'Angular Architect',
    'AI / ML Engineer',
    'IoT Solution Builder',
    'Flutter Developer',
  ];
  currentTitle = '';
  stats = { projects: 0, years: 0, clients: 0 };

  spotX = 0;
  spotY = 0;

  get spotlightBg(): string {
    return `radial-gradient(550px circle at ${this.spotX}px ${this.spotY}px,
      rgba(99, 102, 241, 0.13), transparent 70%)`;
  }

  cardTransform = 'rotateX(0deg) rotateY(0deg) scale(1)';

  private mag: Record<MKey, { x: number; y: number }> = {
    primary: { x: 0, y: 0 },
    outline: { x: 0, y: 0 },
    mail:    { x: 0, y: 0 },
  };

  private ti = 0;
  private ci = 0;
  private del = false;
  private rm = false;
  private dots: Dot[] = [];
  private raf: number | null = null;
  private mx = -9999;
  private my = -9999;

  @HostBinding('class.no-motion') get nm() { return this.rm; }

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
    this.rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.rm) {
      this.currentTitle = this.titles[0];
      this.stats = { projects: 20, years: 3, clients: 15 };
    } else {
      this.typeLoop();
      this.countStats();
    }
  }

  ngAfterViewInit(): void {
    if (!this.rm) this.zone.runOutsideAngular(() => this.initParticles());
  }

  ngOnDestroy(): void {
    if (this.raf !== null) cancelAnimationFrame(this.raf);
  }

  private typeLoop(): void {
    const w = this.titles[this.ti];
    if (!this.del) {
      this.currentTitle = w.slice(0, ++this.ci);
      if (this.ci === w.length) {
        this.del = true;
        setTimeout(() => this.typeLoop(), 2000);
        return;
      }
    } else {
      this.currentTitle = w.slice(0, --this.ci);
      if (this.ci === 0) {
        this.del = false;
        this.ti = (this.ti + 1) % this.titles.length;
      }
    }
    setTimeout(() => this.typeLoop(), this.del ? 40 : 90);
  }

  private countStats(): void {
    const target = { projects: 20, years: 3, clients: 15 };
    const dur = 2400;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 4);
      this.stats.projects = Math.round(e * target.projects);
      this.stats.years    = Math.round(e * target.years);
      this.stats.clients  = Math.round(e * target.clients);
      if (p < 1) requestAnimationFrame(tick);
    };
    setTimeout(() => requestAnimationFrame(tick), 900);
  }

  private initParticles(): void {
    const cv  = this.cvRef.nativeElement;
    const ctx = cv.getContext('2d')!;

    const resize = () => {
      cv.width  = cv.offsetWidth;
      cv.height = cv.offsetHeight;
    };
    resize();
    new ResizeObserver(resize).observe(cv);

    const n = Math.min(65, Math.floor(cv.width * cv.height / 11000));
    for (let i = 0; i < n; i++) {
      this.dots.push({
        x:  Math.random() * cv.width,
        y:  Math.random() * cv.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r:  Math.random() * 1.8 + 0.8,
        a:  Math.random() * 0.5 + 0.3,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);

      for (const d of this.dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > cv.width)  d.vx *= -1;
        if (d.y < 0 || d.y > cv.height)  d.vy *= -1;

        const dx = d.x - this.mx;
        const dy = d.y - this.my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) {
          const f = (100 - dist) / 100;
          d.x += (dx / dist) * f * 2.5;
          d.y += (dy / dist) * f * 2.5;
        }

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129, 140, 248, ${d.a})`;
        ctx.fill();
      }

      for (let i = 0; i < this.dots.length; i++) {
        for (let j = i + 1; j < this.dots.length; j++) {
          const a = this.dots[i];
          const b = this.dots[j];
          const dx   = a.x - b.x;
          const dy   = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${(1 - dist / 130) * 0.3})`;
            ctx.lineWidth   = 0.6;
            ctx.stroke();
          }
        }
      }

      this.raf = requestAnimationFrame(draw);
    };
    draw();
  }

  onHeroMove(e: MouseEvent): void {
    if (this.rm) return;
    const r    = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.spotX = e.clientX - r.left;
    this.spotY = e.clientY - r.top;
    this.mx    = e.clientX - r.left;
    this.my    = e.clientY - r.top;
  }

  onHeroLeave(): void {
    this.mx = -9999;
    this.my = -9999;
  }

  onCardMove(e: MouseEvent, el: HTMLElement): void {
    if (this.rm) return;
    const r  = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width  - 0.5;
    const py = (e.clientY - r.top)  / r.height - 0.5;
    this.cardTransform =
      `rotateX(${py * -18}deg) rotateY(${px * 18}deg) scale(1.03)`;
  }

  onCardLeave(): void {
    this.cardTransform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  }

  onMagnetMove(e: MouseEvent, key: MKey): void {
    if (this.rm) return;
    const el = e.currentTarget as HTMLElement;
    const r  = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width  - 0.5;
    const py = (e.clientY - r.top)  / r.height - 0.5;
    this.mag[key] = { x: px * 18, y: py * 12 };
  }

  onMagnetLeave(key: MKey): void {
    this.mag[key] = { x: 0, y: 0 };
  }

  magnetTransform(key: MKey): string {
    return `translate(${this.mag[key].x}px, ${this.mag[key].y}px)`;
  }
}