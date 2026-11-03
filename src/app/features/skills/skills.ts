import {
  Component, AfterViewInit, OnDestroy,
  ViewChild, ElementRef, NgZone
} from '@angular/core';
import { NgFor } from '@angular/common';

interface Dot { x:number;y:number;vx:number;vy:number;r:number;a:number; }

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [NgFor],
  templateUrl: './skills.html',
  styleUrls: ['./skills.scss']
})
export class SkillsComponent implements AfterViewInit, OnDestroy {

  @ViewChild('netCanvas')    cvRef!:   ElementRef<HTMLCanvasElement>;
  @ViewChild('skillsSection') secRef!: ElementRef;
  @ViewChild('catSection')   catRef!:  ElementRef;
  @ViewChild('profSection')  profRef!: ElementRef;

  v0 = false;
  v1 = false;
  v2 = false;

  spotX = 0;
  spotY = 0;

  get spotBg(): string {
    return `radial-gradient(480px circle at ${this.spotX}px ${this.spotY}px,
      rgba(99,102,241,0.13), transparent 70%)`;
  }

  private dots: Dot[] = [];
  private raf:  number | null = null;
  private mx = -9999;
  private my = -9999;
  private obs: IntersectionObserver[] = [];

  categories = [
    {
      icon: '◈',
      title: 'Frontend & Mobile',
      skills: ['Angular','Flutter','TypeScript','HTML / CSS','RxJS'],
    },
    {
      icon: '⚡',
      title: 'Backend & Cloud',
      skills: ['Firebase','Python','Node.js','REST APIs','Firestore'],
    },
    {
      icon: '◉',
      title: 'AI / Machine Learning',
      skills: ['TensorFlow','Scikit-learn','Pandas','NumPy','OpenAI'],
    },
    {
      icon: '◌',
      title: 'Systems & Other',
      skills: ['C++','DBMS','Networking','Info Security','Sysadmin'],
    },
  ];

  proficiency = [
    { name: 'Angular',           level: 92 },
    { name: 'Flutter',           level: 88 },
    { name: 'Firebase',          level: 90 },
    { name: 'Python',            level: 85 },
    { name: 'Machine Learning',  level: 78 },
    { name: 'C++',               level: 75 },
  ];

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => this.initCanvas());
    this.watch(this.secRef,  () => { this.v0 = true; });
    this.watch(this.catRef,  () => { this.v1 = true; });
    this.watch(this.profRef, () => { this.v2 = true; });
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

        /* identical to hero — indigo particles */
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129,140,248,${d.a})`;
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
            /* identical to hero — cyan lines */
            ctx.strokeStyle = `rgba(34,211,238,${(1 - d / 130) * 0.22})`;
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
}