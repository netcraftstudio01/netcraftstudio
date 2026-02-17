import { useState, useEffect } from 'react';
import type { PortfolioProject } from '@/data/siteData';

interface ApiProject {
  id: string | number;
  title: string;
  category: string;
  description: string;
  full_description: string;
  image: string;
  tags: string[] | string;
  features: string[] | string;
  technologies: string[] | string;
  year: number | string;
  client: string;
  live_url: string;
  source_code_url: string;
}

interface Client {
  id: string | number;
  name: string;
  [key: string]: unknown;
}

interface TeamMember {
  id: string | number;
  name: string;
  [key: string]: unknown;
}

export const usePortfolioData = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        console.log('Fetching from API:', apiUrl);

        // Fetch portfolio projects
        const projectsRes = await fetch(`${apiUrl}/api/projects`);
        if (!projectsRes.ok) throw new Error(`Failed to fetch projects: ${projectsRes.status}`);
        
        const projectsText = await projectsRes.text();
        let projectsData;
        try {
          projectsData = JSON.parse(projectsText);
        } catch (e) {
          console.error('Invalid JSON response from /api/projects:', projectsText.substring(0, 200));
          throw new Error('Backend returned invalid JSON. Check if backend is running and VITE_API_URL is correct.');
        }
        
        // Transform database data to match the app's format
        const transformedProjects = projectsData.map((project: ApiProject) => ({
          id: project.id,
          title: project.title,
          category: project.category,
          description: project.description,
          fullDescription: project.full_description,
          image: project.image,
          tags: Array.isArray(project.tags) ? project.tags : JSON.parse(project.tags || '[]'),
          features: Array.isArray(project.features) ? project.features : JSON.parse(project.features || '[]'),
          technologies: Array.isArray(project.technologies) ? project.technologies : JSON.parse(project.technologies || '[]'),
          year: project.year,
          client: project.client,
          liveUrl: project.live_url,
          sourceCodeUrl: project.source_code_url,
        }));
        
        setProjects(transformedProjects);

        // Fetch clients
        const clientsRes = await fetch(`${apiUrl}/api/clients`);
        if (clientsRes.ok) {
          const clientsText = await clientsRes.text();
          try {
            const clientsData = JSON.parse(clientsText);
            setClients(clientsData);
          } catch (e) {
            console.error('Invalid JSON from /api/clients:', clientsText.substring(0, 200));
          }
        }

        // Fetch team members
        const teamRes = await fetch(`${apiUrl}/api/team`);
        if (teamRes.ok) {
          const teamText = await teamRes.text();
          try {
            const teamData = JSON.parse(teamText);
            setTeamMembers(teamData);
          } catch (e) {
            console.error('Invalid JSON from /api/team:', teamText.substring(0, 200));
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { projects, clients, teamMembers, loading, error };
};
