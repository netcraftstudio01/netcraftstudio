import { useState, useEffect, useCallback, useRef } from 'react';
import type { PortfolioProject, Client } from '@/data/siteData';
import { getApiUrl } from '@/lib/api';

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

interface UsePortfolioDataOptions {
  /** Whether to fetch projects data */
  fetchProjects?: boolean;
  /** Whether to fetch clients data */
  fetchClients?: boolean;
}

// In-memory cache to prevent duplicate requests across component remounts
const dataCache: {
  projects: PortfolioProject[] | null;
  clients: Client[] | null;
  projectsTimestamp: number;
  clientsTimestamp: number;
  ttl: number; // Time-to-live in milliseconds
} = {
  projects: null,
  clients: null,
  projectsTimestamp: 0,
  clientsTimestamp: 0,
  ttl: 5 * 60 * 1000, // 5 minutes cache
};

// Request deduplication - prevents multiple simultaneous fetches
let projectsFetchPromise: Promise<PortfolioProject[] | null> | null = null;
let clientsFetchPromise: Promise<Client[] | null> | null = null;

const isProjectsCacheValid = () => {
  return dataCache.projectsTimestamp > 0 && Date.now() - dataCache.projectsTimestamp < dataCache.ttl;
};

const isClientsCacheValid = () => {
  return dataCache.clientsTimestamp > 0 && Date.now() - dataCache.clientsTimestamp < dataCache.ttl;
};

const clearCache = () => {
  dataCache.projects = null;
  dataCache.clients = null;
  dataCache.projectsTimestamp = 0;
  dataCache.clientsTimestamp = 0;
};

export const usePortfolioData = (options: UsePortfolioDataOptions = {}) => {
  const { fetchProjects = false, fetchClients = false } = options;
  
  const [projects, setProjects] = useState<PortfolioProject[]>(
    fetchProjects && dataCache.projects ? dataCache.projects : []
  );
  const [clients, setClients] = useState<Client[]>(
    fetchClients && dataCache.clients ? dataCache.clients : []
  );
  const [loading, setLoading] = useState(
    (fetchProjects && !isProjectsCacheValid()) || (fetchClients && !isClientsCacheValid())
  );
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  // Transform API project data to app format
  const transformProject = useCallback((project: ApiProject): PortfolioProject => ({
    id: typeof project.id === 'number' ? project.id : parseInt(String(project.id), 10),
    title: project.title,
    category: project.category,
    description: project.description,
    fullDescription: project.full_description || "",
    image: project.image,
    tags: Array.isArray(project.tags) ? project.tags : JSON.parse(project.tags || '[]'),
    features: Array.isArray(project.features) ? project.features : JSON.parse(project.features || '[]'),
    technologies: Array.isArray(project.technologies) ? project.technologies : JSON.parse(project.technologies || '[]'),
    year: String(project.year),
    client: project.client,
    liveUrl: project.live_url || "",
    sourceCodeUrl: project.source_code_url || "",
  }), []);

  // Fetch projects from API
  const fetchProjectsData = useCallback(async (): Promise<PortfolioProject[] | null> => {
    if (projectsFetchPromise) return projectsFetchPromise;
    
    projectsFetchPromise = (async () => {
      try {
        const apiUrl = getApiUrl();
        const res = await fetch(`${apiUrl}/api/projects`);
        if (!res.ok) {
          console.error(`Projects API error ${res.status}`);
          return null;
        }
        const text = await res.text();
        const data = JSON.parse(text) as ApiProject[];
        const transformedProjects = data.map(transformProject);
        
        // Cache the data
        dataCache.projects = transformedProjects;
        dataCache.projectsTimestamp = Date.now();
        
        return transformedProjects;
      } catch (e) {
        console.error('Failed to fetch projects:', e);
        return null;
      } finally {
        projectsFetchPromise = null;
      }
    })();
    
    return projectsFetchPromise;
  }, [transformProject]);

  // Fetch clients from API
  const fetchClientsData = useCallback(async (): Promise<Client[] | null> => {
    if (clientsFetchPromise) return clientsFetchPromise;
    
    clientsFetchPromise = (async () => {
      try {
        const apiUrl = getApiUrl();
        const res = await fetch(`${apiUrl}/api/clients`);
        if (!res.ok) {
          console.error(`Clients API error ${res.status}`);
          return null;
        }
        const text = await res.text();
        const data = JSON.parse(text) as Record<string, unknown>[];
        const typedClients = data.map(c => ({
          id: typeof c.id === 'number' ? c.id : parseInt(String(c.id), 10),
          name: String(c.name || ''),
          image: String(c.image || ''),
          alt: String(c.alt || c.name || ''),
        }));
        
        // Cache the data
        dataCache.clients = typedClients;
        dataCache.clientsTimestamp = Date.now();
        
        return typedClients;
      } catch (e) {
        console.error('Failed to fetch clients:', e);
        return null;
      } finally {
        clientsFetchPromise = null;
      }
    })();
    
    return clientsFetchPromise;
  }, []);

  useEffect(() => {
    isMounted.current = true;
    
    // Only fetch what's requested and not cached
    const shouldFetchProjects = fetchProjects && !isProjectsCacheValid();
    const shouldFetchClients = fetchClients && !isClientsCacheValid();
    
    // Return cached data immediately if valid
    if (fetchProjects && isProjectsCacheValid() && dataCache.projects) {
      setProjects(dataCache.projects);
    }
    if (fetchClients && isClientsCacheValid() && dataCache.clients) {
      setClients(dataCache.clients);
    }
    
    // If no fetching needed, complete loading
    if (!shouldFetchProjects && !shouldFetchClients) {
      setLoading(false);
      return;
    }

    const performFetch = async () => {
      if (!isMounted.current) return;
      
      setLoading(true);
      setError(null);
      
      console.log(`Fetching from API: ${shouldFetchProjects ? 'projects' : ''} ${shouldFetchClients ? 'clients' : ''} (${import.meta.env.MODE === 'development' ? 'proxied to backend' : `direct API`})`);

      try {
        // Only fetch what's requested
        const fetchPromises: Promise<any>[] = [];
        
        if (shouldFetchProjects) {
          fetchPromises.push(fetchProjectsData());
        }
        
        if (shouldFetchClients) {
          fetchPromises.push(fetchClientsData());
        }

        const results = await Promise.all(fetchPromises);
        
        if (!isMounted.current) return;

        let resultIndex = 0;
        
        // Process results in order
        if (shouldFetchProjects) {
          const projectsData = results[resultIndex++];
          if (projectsData) {
            setProjects(projectsData);
          }
        }
        
        if (shouldFetchClients) {
          const clientsData = results[resultIndex++];
          if (clientsData) {
            setClients(clientsData);
          }
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        if (isMounted.current) {
          setError(err instanceof Error ? err.message : 'Failed to fetch data');
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    performFetch();
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchProjects, fetchClients, fetchProjectsData, fetchClientsData]);

  // Function to manually refresh data (clears relevant cache)
  const refresh = useCallback(async () => {
    if (fetchProjects) {
      dataCache.projects = null;
      dataCache.projectsTimestamp = 0;
    }
    if (fetchClients) {
      dataCache.clients = null;
      dataCache.clientsTimestamp = 0;
    }
    setLoading(true);
    setError(null);
    
    try {
      const fetchPromises: Promise<any>[] = [];
      
      if (fetchProjects) {
        fetchPromises.push(fetchProjectsData());
      }
      
      if (fetchClients) {
        fetchPromises.push(fetchClientsData());
      }
      
      const results = await Promise.all(fetchPromises);
      
      if (fetchProjects) {
        const projectsData = results[fetchClients ? 0 : 0];
        if (projectsData && isMounted.current) {
          setProjects(projectsData);
        }
      }
      
      if (fetchClients) {
        const clientsData = results[fetchProjects ? 1 : 0];
        if (clientsData && isMounted.current) {
          setClients(clientsData);
        }
      }
    } catch (error) {
      if (isMounted.current) {
        setError(error instanceof Error ? error.message : 'Failed to refresh data');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [fetchProjects, fetchClients, fetchProjectsData, fetchClientsData]);

  // Individual refetch functions
  const refetchProjects = useCallback(async () => {
    if (!fetchProjects) return;
    
    dataCache.projects = null;
    dataCache.projectsTimestamp = 0;
    setLoading(true);
    setError(null);
    
    try {
      const projectsData = await fetchProjectsData();
      if (projectsData && isMounted.current) {
        setProjects(projectsData);
      }
    } catch (error) {
      if (isMounted.current) {
        setError(error instanceof Error ? error.message : 'Failed to fetch projects');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [fetchProjects, fetchProjectsData]);

  const refetchClients = useCallback(async () => {
    if (!fetchClients) return;
    
    dataCache.clients = null;
    dataCache.clientsTimestamp = 0;
    setLoading(true);
    setError(null);
    
    try {
      const clientsData = await fetchClientsData();
      if (clientsData && isMounted.current) {
        setClients(clientsData);
      }
    } catch (error) {
      if (isMounted.current) {
        setError(error instanceof Error ? error.message : 'Failed to fetch clients');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [fetchClients, fetchClientsData]);

  return { 
    projects, 
    clients, 
    loading, 
    error, 
    refresh,
    refetchProjects,
    refetchClients
  };
};

// Export cache control for admin panel
export { clearCache as clearPortfolioCache };

// Convenience hooks for specific data types
export const useProjects = (): { projects: PortfolioProject[], loading: boolean, error: string | null, refresh: () => Promise<void> } => {
  const { projects, loading, error, refresh } = usePortfolioData({ fetchProjects: true });
  return { projects, loading, error, refresh };
};

export const useClients = (): { clients: Client[], loading: boolean, error: string | null, refresh: () => Promise<void> } => {
  const { clients, loading, error, refresh } = usePortfolioData({ fetchClients: true });
  return { clients, loading, error, refresh };
};
