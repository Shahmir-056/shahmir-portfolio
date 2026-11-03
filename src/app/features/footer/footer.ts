import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgFor],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class FooterComponent {

  year = new Date().getFullYear();

  navLinks = [
    { label: 'Home',       href: '#home'       },
    { label: 'About',      href: '#about'       },
    { label: 'Skills',     href: '#skills'      },
    { label: 'Projects',   href: '#projects'    },
    { label: 'Experience', href: '#experience'  },
    { label: 'Contact',    href: '#contact'     },
  ];
}