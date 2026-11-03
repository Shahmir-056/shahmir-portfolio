export interface Project {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  github: string;
  demo?: string;
}

export const PROJECTS: Project[] = [
  {
    title: 'New Pak Al-Ghani',
    description:
      'Production-ready travel and tourism website developed using Angular and Firebase for a real client.',
    technologies: ['Angular', 'Firebase', 'TypeScript', 'SCSS'],
    image: 'projects/newpakalghani.png',
    github: 'https://github.com/Shahmir-056',
    demo: 'https://www.newpakalghani.com'
  },

  {
    title: 'IoT Air Purification System',
    description:
      'Real-time CO₂ monitoring and purification dashboard using IoT sensors and database integration.',
    technologies: ['IoT', 'Sensors', 'Dashboard', 'Database'],
    image: 'projects/iot-system.png',
    github: 'https://github.com/Shahmir-056'
  },

  {
    title: 'Movie Recommendation System',
    description:
      'Machine learning recommendation engine developed using Python.',
    technologies: ['Python', 'Machine Learning'],
    image: 'projects/movie-system.png',
    github: 'https://github.com/Shahmir-056'
  },

  {
    title: 'E-Commerce Platform',
    description:
      'Full-stack e-commerce application developed during internship.',
    technologies: ['Angular', 'Firebase', 'Authentication'],
    image: 'projects/ecommerce.png',
    github: 'https://github.com/Shahmir-056'
  },

  {
    title: 'Multiple Development Projects',
    description:
      'Collection of dashboards, CRUD applications, admin panels and responsive web applications.',
    technologies: ['Angular', 'TypeScript', 'Firebase'],
    image: 'projects/development-projects.png',
    github: 'https://github.com/Shahmir-056'
  }
];