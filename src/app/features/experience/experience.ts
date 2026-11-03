import {
  Component, AfterViewInit, OnDestroy,
  ViewChild, ElementRef, NgZone
} from '@angular/core';
import { NgFor, NgClass } from '@angular/common';

interface Dot { x:number;y:number;vx:number;vy:number;r:number;a:number; }

interface Item {
  year: string;
  type: string;
  typeKey: string;
  icon: string;
  title: string;
  org: string;
  description: string;
  statusKey: string;
  statusLabel: string;
  tags: string[];
}

interface Column {
  type: string;
  typeKey: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './experience.html',
  styleUrls: ['./experience.scss']
})
export class ExperienceComponent implements AfterViewInit, OnDestroy {

  @ViewChild('netCanvas')  cvRef!:   ElementRef<HTMLCanvasElement>;
  @ViewChild('expSection') secRef!:  ElementRef;
  @ViewChild('gridSection') gridRef!: ElementRef;

  v0 = false;
  v1 = false;

  spotX = 0;
  spotY = 0;

  get spotBg(): string {
    return `radial-gradient(480px circle at ${this.spotX}px ${this.spotY}px,
      rgba(99,102,241,0.13), transparent 70%)`;
  }

  filters = ['All', 'Education', 'Experience', 'Project'];
  activeFilter = 'All';

  stripStats = [
    { val: '2022', lbl: 'Started' },
    { val: '1',    lbl: 'Internship' },
    { val: '3',    lbl: 'Live projects' },
    { val: '2026', lbl: 'Graduating' },
  ];

  readonly allColumns: Column[] = [
    { type: 'Education',  typeKey: 'edu',  icon: '◉', label: 'Education'  },
    { type: 'Experience', typeKey: 'exp',  icon: '⚡', label: 'Experience' },
    { type: 'Project',    typeKey: 'proj', icon: '◈', label: 'Projects'   },
  ];

  get visibleColumns(): Column[] {
    if (this.activeFilter === 'All') return this.allColumns;
    return this.allColumns.filter(c => c.type === this.activeFilter);
  }

  readonly timeline: Item[] = [
    {
      year: '2022', type: 'Education', typeKey: 'edu', icon: '◉',
      title: 'BS Information Technology',
      org: 'University of Gujrat',
      description: 'Started BSIT — building foundations in software engineering, AI, networking and systems design.',
      statusKey: 'active', statusLabel: 'Active',
      tags: ['CS Fundamentals', 'Networking', 'DBMS'],
    },
    {
      year: '2026', type: 'Education', typeKey: 'edu', icon: '◉',
      title: 'BSIT Graduation',
      org: 'University of Gujrat',
      description: 'Expected graduation — fully ready for software engineering, AI and IoT roles.',
      statusKey: 'upcoming', statusLabel: 'Upcoming',
      tags: ['Graduating', 'Open to Work'],
    },
    {
      year: '2024', type: 'Experience', typeKey: 'exp', icon: '⚡',
      title: 'Web Development Internship',
      org: 'Gujrat Software House',
      description: 'Professional Angular internship — delivered production features for real client projects in a team environment.',
      statusKey: 'done', statusLabel: 'Completed',
      tags: ['Angular', 'REST APIs', 'Team Workflow'],
    },
    {
      year: '2023', type: 'Project', typeKey: 'proj', icon: '◈',
      title: 'Angular & Firebase Apps',
      org: 'Self-initiated',
      description: 'Multiple full-stack web apps — real-time databases, auth flows and cloud deployment pipelines.',
      statusKey: 'done', statusLabel: 'Completed',
      tags: ['Angular', 'Firebase', 'TypeScript'],
    },
    {
      year: '2025', type: 'Project', typeKey: 'proj', icon: '◈',
      title: 'New Pak Al Ghani Website',
      org: 'Freelance',
      description: 'Full production business website — designed, built and deployed with Angular and Firebase. Live.',
      statusKey: 'live', statusLabel: 'Live',
      tags: ['Angular', 'Firebase', 'Production'],
    },
    {
      year: '2025', type: 'Project', typeKey: 'proj', icon: '◈',
      title: 'ArtifTree — IoT Dashboard',
      org: 'Academic Project',
      description: 'Flutter + Firebase real-time IoT dashboard — CO₂, temperature, humidity with live graphs and device control.',
      statusKey: 'done', statusLabel: 'Completed',
      tags: ['Flutter', 'Firebase', 'IoT', 'C++'],
    },
  ];

  getItems(type: string): Item[] {
    return this.timeline.filter(i => i.type === type);
  }

  getCount(filter: string): number {
    if (filter === 'All') return this.timeline.length;
    return this.timeline.filter(i => i.type === filter).length;
  }

  setFilter(f: string): void {
    this.activeFilter = f;
    this.v1 = false;
    setTimeout(() => { this.v1 = true; }, 60);
  }

  private dots: Dot[] = [];
  private raf: number | null = null;
  private mx = -9999;
  private my = -9999;
  private obs: IntersectionObserver[] = [];

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => this.initCanvas());
    this.watch(this.secRef,  () => { this.v0 = true; });
    this.watch(this.gridRef, () => { this.v1 = true; });
  }

  ngOnDestroy(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.obs.forEach(o => o.disconnect());
  }

  private watch(ref: ElementRef, cb: () => void): void {
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { this.zone.run(cb); o.disconnect(); } },
      { threshold: 0.08 }
    );
    o.observe(ref.nativeElement);
    this.obs.push(o);
  }

  private initCanvas(): void {
    const cv  = this.cvRef.nativeElement;
    const ctx = cv.getContext('2d')!;
    const resize = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
    resize();
    new ResizeObserver(resize).observe(cv);

    const n = Math.min(55, Math.floor(cv.width * cv.height / 13000));
    for (let i = 0; i < n; i++) {
      this.dots.push({
        x: Math.random() * cv.width, y: Math.random() * cv.height,
        vx: (Math.random() - 0.5) * 0.45, vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.6 + 0.7, a: Math.random() * 0.45 + 0.25,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (const d of this.dots) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > cv.width)  d.vx *= -1;
        if (d.y < 0 || d.y > cv.height)  d.vy *= -1;
        const dx = d.x - this.mx, dy = d.y - this.my;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100 && dist > 0) { const f=(100-dist)/100; d.x+=(dx/dist)*f*2; d.y+=(dy/dist)*f*2; }
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(129,140,248,${d.a})`; ctx.fill();
      }
      for (let i = 0; i < this.dots.length; i++) {
        for (let j = i+1; j < this.dots.length; j++) {
          const a = this.dots[i], b = this.dots[j];
          const dx = a.x-b.x, dy = a.y-b.y, d = Math.sqrt(dx*dx+dy*dy);
          if (d < 130) {
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
            ctx.strokeStyle = `rgba(34,211,238,${(1-d/130)*0.22})`; ctx.lineWidth=0.6; ctx.stroke();
          }
        }
      }
      this.raf = requestAnimationFrame(draw);
    };
    draw();
  }

  onMove(e: MouseEvent): void {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.spotX = e.clientX - r.left; this.spotY = e.clientY - r.top;
    this.mx = e.clientX - r.left;    this.my = e.clientY - r.top;
  }
  onLeave(): void { this.mx = -9999; this.my = -9999; }
}