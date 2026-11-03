import {
  Component, AfterViewInit, OnDestroy,
  ViewChild, ElementRef, NgZone
} from '@angular/core';
import { NgFor } from '@angular/common';

type MKey = 'cv' | 'ct';
interface Dot { x:number; y:number; vx:number; vy:number; r:number; a:number; }

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [NgFor],
  templateUrl: './about.html',
  styleUrls: ['./about.scss']
})
export class AboutComponent implements AfterViewInit, OnDestroy {

  @ViewChild('netCanvas')    cvRef!:    ElementRef<HTMLCanvasElement>;
  @ViewChild('aboutSection') secRef!:   ElementRef;
  @ViewChild('statsSection') statsRef!: ElementRef;
  @ViewChild('focusSection') focusRef!: ElementRef;

  v0 = false;
  v1 = false;
  v2 = false;

  spotX = 0; spotY = 0;
  get spotBg(): string {
  return `radial-gradient(480px circle at ${this.spotX}px ${this.spotY}px,
    rgba(99, 102, 241, 0.13), transparent 70%)`;
}

  private mag: Record<MKey,{x:number;y:number}> = {
    cv:{x:0,y:0}, ct:{x:0,y:0}
  };
  private dots:  Dot[] = [];
  private raf:   number | null = null;
  private mx = -9999;
  private my = -9999;
  private obs: IntersectionObserver[] = [];

  highlights = [
    'Angular, Flutter & Firebase — production grade',
    'AI / ML model integration & deployment',
    'IoT systems with real-time sensor dashboards',
    'Clean, scalable, maintainable architecture',
  ];

  stackLines = ['Angular','Flutter','Firebase','Python','TensorFlow','C++'];

  stats = [
    { icon:'◈', label:'Projects shipped', current:0, target:20,   suffix:'+', pct:85 },
    { icon:'⚡', label:'Technologies',     current:0, target:15,   suffix:'+', pct:70 },
    { icon:'◎', label:'Deployments',       current:0, target:3,    suffix:'+', pct:55 },
    { icon:'◉', label:'Graduation',        current:0, target:2026, suffix:'',  pct:92 },
  ];

  focusAreas = [
    {
      icon:'◈', title:'Web Development',
      desc:'Fast, scalable, production-grade web apps with modern frameworks and clean architecture.',
      tags:['Angular','TypeScript','Firebase','REST APIs'],
    },
    {
      icon:'⚡', title:'AI / ML Engineering',
      desc:'Intelligent systems, models and data pipelines integrated into real products.',
      tags:['Python','TensorFlow','Scikit-learn','OpenAI'],
    },
    {
      icon:'◌', title:'IoT Solutions',
      desc:'Real-world sensor networks with live dashboards and remote hardware control.',
      tags:['Flutter','Firebase','C++','Arduino'],
    },
  ];

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => this.initCanvas());
    this.watch(this.secRef,   () => { this.v0 = true; });
    this.watch(this.statsRef, () => { this.v1 = true; this.count(); });
    this.watch(this.focusRef, () => { this.v2 = true; });
  }

  ngOnDestroy(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.obs.forEach(o => o.disconnect());
  }

  private watch(ref: ElementRef, cb: () => void): void {
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { this.zone.run(cb); o.disconnect(); } },
      { threshold: 0.1 }
    );
    o.observe(ref.nativeElement);
    this.obs.push(o);
  }

  private count(): void {
    const dur = 2000;
    const t0  = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 4);
      this.zone.run(() => {
        this.stats.forEach(s => s.current = Math.round(e * s.target));
      });
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  private initCanvas(): void {
  const cv  = this.cvRef.nativeElement;
  const ctx = cv.getContext('2d')!;

  const resize = () => {
    cv.width  = cv.offsetWidth;
    cv.height = cv.offsetHeight;
  };
  resize();
  new ResizeObserver(resize).observe(cv);

  const n = Math.min(55, Math.floor(cv.width * cv.height / 13000));
  for (let i = 0; i < n; i++) {
    this.dots.push({
      x:  Math.random() * cv.width,
      y:  Math.random() * cv.height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r:  Math.random() * 1.6 + 0.7,
      a:  Math.random() * 0.45 + 0.25,
    });
  }

  const draw = () => {
    ctx.clearRect(0, 0, cv.width, cv.height);

    for (const d of this.dots) {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > cv.width)  d.vx *= -1;
      if (d.y < 0 || d.y > cv.height)  d.vy *= -1;

      const dx   = d.x - this.mx;
      const dy   = d.y - this.my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100 && dist > 0) {
        const f = (100 - dist) / 100;
        d.x += (dx / dist) * f * 2;
        d.y += (dy / dist) * f * 2;
      }

      /* ── same indigo colour as hero ── */
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(129, 140, 248, ${d.a})`;
      ctx.fill();
    }

    for (let i = 0; i < this.dots.length; i++) {
      for (let j = i + 1; j < this.dots.length; j++) {
        const a  = this.dots[i];
        const b  = this.dots[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          /* ── same cyan colour as hero ── */
          ctx.strokeStyle = `rgba(34, 211, 238, ${(1 - d / 130) * 0.22})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }

    this.raf = requestAnimationFrame(draw);
  };
  draw();
}
  onMove(e: MouseEvent): void {
    const r    = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.spotX = e.clientX - r.left;
    this.spotY = e.clientY - r.top;
    this.mx    = e.clientX - r.left;
    this.my    = e.clientY - r.top;
  }

  onLeave(): void { this.mx = -9999; this.my = -9999; }

  onMag(ev: MouseEvent, k: MKey): void {
    const el = ev.currentTarget as HTMLElement;
    const r  = el.getBoundingClientRect();
    this.mag[k] = {
      x: ((ev.clientX - r.left) / r.width  - 0.5) * 14,
      y: ((ev.clientY - r.top)  / r.height - 0.5) * 9,
    };
  }

  offMag(k: MKey): void { this.mag[k] = {x:0,y:0}; }
  magStyle(k: MKey): string {
    return `translate(${this.mag[k].x}px,${this.mag[k].y}px)`;
  }
}