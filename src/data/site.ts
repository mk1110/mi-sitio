import type { IconName } from '../types';

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: IconName;
}

export interface SkillGroup {
  category: string;
  icon: IconName;
  items: string[];
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  /** Enlace al código. Opcional si el proyecto solo tiene sitio publicado. */
  repo?: string;
  /** Enlace al sitio en producción. */
  demo?: string;
  featured?: boolean;
}

/* ------------------------------------------------------------------ */
/*  TU CONTENIDO ESTÁ AQUÍ. Edita SOLO este archivo para actualizar     */
/*  todo el sitio: nombre, redes, email, stack y proyectos.             */
/* ------------------------------------------------------------------ */

export const site = {
  name: 'Aballay Mariano',
  shortName: 'Aballay Mariano',
  role: 'Desarrollador Web Full Stack',
  tagline: 'Construyo productos web completos, de la base de datos a la interfaz.',
  description:
    'Desarrollador web full stack especializado en convertir ideas en productos digitales sólidos, rápidos y mantenibles.',
  location: 'San Juan, Argentina',
  availability: 'Disponible para nuevos proyectos',
  /**
   * Tu email público. Mientras esté vacío, el contacto principal se hace por
   * Instagram y el icono de email no se muestra en las listas de redes.
   */
  email: 'mk1110aballay@gmail.com',
  instagram: 'https://www.instagram.com/mkap_1110/',
} satisfies {
  name: string;
  shortName: string;
  role: string;
  tagline: string;
  description: string;
  location: string;
  availability: string;
  email: string;
  instagram: string;
};

export const socials: SocialLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/mk1110',
    icon: 'github',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mariano-kevin-aballay-paredes-36922b2b6/',
    icon: 'linkedin',
  },
  {
    label: 'Instagram',
    href: site.instagram,
    icon: 'instagram',
  },
  // El email solo entra en la lista si lo configuraste arriba
  ...(site.email
    ? [{ label: 'Email', href: `mailto:${site.email}`, icon: 'mail' as IconName }]
    : []),
];

export const nav: NavLink[] = [
  { label: 'Sobre mí', href: '#sobre-mi' },
  { label: 'Stack', href: '#stack' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Contacto', href: '#contacto' },
];

export const skills: SkillGroup[] = [
  {
    category: 'Frontend',
    icon: 'monitor',
    items: ['TypeScript', 'Astro', 'Tailwind CSS', 'HTML5', 'CSS3'],
  },
  {
    category: 'Backend',
    icon: 'server',
    items: ['Node.js', 'Flask', 'Python', 'REST APIs', 'GraphQL'],
  },
  {
    category: 'Bases de datos',
    icon: 'database',
    items: ['MySQL', 'Supabase', 'SQLite'],
  },
  {
    category: 'Herramientas',
    icon: 'wrench',
    items: ['Git', 'GitHub Actions', 'Docker', 'Vite', 'Figma'],
  },
];

export const projects: Project[] = [
  {
    title: 'Stock de Productos',
    description:
      'Sitio web para la gestión de stock: control de inventario, existencias y movimientos de productos.',
    tags: ['Python', 'Flask', 'Bootstrap'],
    demo: 'https://web-production-22718.up.railway.app',
  },
  {
    title: 'Peluquería Elegant Man',
    description:
      'Sitio web para una peluquería: servicios, precios, ubicación y contacto con cita previa.',
    tags: ['Python', 'Flask', 'Bootstrap'],
    demo: 'https://peluqueriaelegantman.vercel.app',
  },
];

/** Construye un enlace mailto: con asunto y cuerpo prellenados. */
export function mailto(subject: string, body?: string): string {
  const params = new URLSearchParams({ subject });
  if (body) params.set('body', body);
  return `mailto:${site.email}?${params.toString()}`;
}

/**
 * Canal de contacto principal. Si defines un email en `site.email` se usa un
 * mailto: con asunto prellenado; si lo dejas vacío, el contacto es por Instagram.
 */
export const contact = {
  label: site.email ? 'Escríbeme' : 'Escríbeme por Instagram',
  href: site.email
    ? mailto('Contacto desde tu portfolio', 'Hola, me gustaría hablar contigo sobre...')
    : site.instagram,
  /** Dato de contacto que se muestra junto al CTA. */
  detail:
    site.email || `@${site.instagram.split('/').filter(Boolean).pop()}`,
  icon: (site.email ? 'mail' : 'instagram') as IconName,
};
