import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeroComponent } from './features/hero/hero';
import { SkillsComponent } from './features/skills/skills';
import { AboutComponent } from './features/about/about';
import { ProjectsComponent } from './features/projects/projects';
import { ExperienceComponent } from './features/experience/experience';
import { ContactComponent } from './features/contact/contact';
import { NavbarComponent } from './shared/navbar/navbar';
import { FooterComponent } from './features/footer/footer';
@Component({
  selector: 'app-root',
 imports: [
  NavbarComponent,
  HeroComponent,
  AboutComponent,
  SkillsComponent,
  ProjectsComponent,
  ExperienceComponent,
  ContactComponent,
  FooterComponent
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('shahmir-portfolio');
}
