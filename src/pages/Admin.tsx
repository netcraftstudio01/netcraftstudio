import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { useCloudinaryMigration } from "@/hooks/useCloudinaryMigration";
import { getApiUrl } from "@/lib/api";
import {
  getClients,
  getPortfolioProjects,
  setClients,
  setPortfolioProjects,
  type Client,
  type PortfolioProject,
} from "@/data/siteData";

const emptyProjectForm = {
  title: "",
  category: "",
  description: "",
  fullDescription: "",
  image: "",
  tags: "",
  features: "",
  technologies: "",
  year: "",
  client: "",
  liveUrl: "",
  sourceCodeUrl: "",
};

const emptyClientForm = {
  name: "",
  image: "",
  alt: "",
};

const ADMIN_PASSWORD = "Netcraft@2005";

const toList = (value: string | undefined | null) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const getNextId = (items: Array<{ id: number }>) =>
  Math.max(0, ...items.map((item) => item.id)) + 1;

// Transform API data from snake_case to camelCase
const transformProjectFromAPI = (project: Record<string, unknown>): PortfolioProject => ({
  id: project.id as number,
  title: project.title as string,
  category: project.category as string,
  description: project.description as string,
  fullDescription: (project.full_description || project.fullDescription || "") as string,
  image: project.image as string,
  tags: Array.isArray(project.tags) ? project.tags : JSON.parse((project.tags as string) || '[]'),
  features: Array.isArray(project.features) ? project.features : JSON.parse((project.features as string) || '[]'),
  technologies: Array.isArray(project.technologies) ? project.technologies : JSON.parse((project.technologies as string) || '[]'),
  year: project.year as string,
  client: project.client as string,
  liveUrl: (project.live_url || project.liveUrl || "") as string,
  sourceCodeUrl: (project.source_code_url || project.sourceCodeUrl || "") as string,
});

// Helper function to handle image format (base64, Cloudinary URL, or local)
const getImageForDisplay = (imageSrc: string): string => {
  if (!imageSrc) return "";
  
  // Keep Cloudinary URLs as-is
  if (imageSrc.includes('cloudinary.com')) {
    return imageSrc;
  }
  
  // Keep base64 data as-is
  if (imageSrc.startsWith('data:image/')) {
    return imageSrc;
  }

  // For storage keys or other formats, return a placeholder
  if (imageSrc.startsWith('storage:')) {
    return "/img/placeholder.jpg";
  }
  
  // Return as-is for other URLs
  return imageSrc;
};

const Admin = () => {
  const { 
    uploadImage, 
    uploading: isUploading, 
    uploadError
  } = useCloudinaryUpload();
  
  const { isBase64DataURI, migrateBase64ToCloudinary } = useCloudinaryMigration();
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [projects, setProjects] = useState<PortfolioProject[]>(() =>
    getPortfolioProjects()
  );
  const [clients, setClientList] = useState<Client[]>(() => getClients());
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editingClientId, setEditingClientId] = useState<number | null>(null);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [clientForm, setClientForm] = useState(emptyClientForm);

  useEffect(() => {
    const loadDataFromAPI = async () => {
      try {
        const apiUrl = getApiUrl();
        const [projectsRes, clientsRes] = await Promise.all([
          fetch(`${apiUrl}/api/projects`),
          fetch(`${apiUrl}/api/clients`),
        ]);

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          // Transform API data from snake_case to camelCase
          const transformedProjects = projectsData.map(transformProjectFromAPI);
          
          // Process images for display
          const projectsWithImages = transformedProjects.map((project) => ({
            ...project,
            image: getImageForDisplay(project.image),
          }));
          
          setProjects(projectsWithImages);
          setPortfolioProjects(projectsWithImages, false);
        } else {
          // Fallback to localStorage if API fails
          setProjects(getPortfolioProjects());
        }

        if (clientsRes.ok) {
          const clientsData = await clientsRes.json();
          
          // Convert all client images to base64 if not already
          const clientsWithImages = clientsData.map((client: Client) => ({
            ...client,
            image: getImageForDisplay(client.image),
          }));
          
          setClientList(clientsWithImages);
          setClients(clientsWithImages, false);
        } else {
          setClientList(getClients());
        }
      } catch (error) {
        console.error('Error loading data from API, using localStorage:', error);
        setProjects(getPortfolioProjects());
        setClientList(getClients());
      }
    };

    loadDataFromAPI();
    window.addEventListener("ncs-data-updated", loadDataFromAPI);

    return () => {
      window.removeEventListener("ncs-data-updated", loadDataFromAPI);
    };
  }, []);

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjectForm(emptyProjectForm);
  };

  const resetClientForm = () => {
    setEditingClientId(null);
    setClientForm(emptyClientForm);
  };

  const handleAuthSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthorized(true);
      setAuthError("");
      setPasswordInput("");
      return;
    }

    setAuthError("Incorrect password.");
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setPasswordInput("");
    setAuthError("");
  };

  const handleProjectSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const title = String(projectForm.title || "").trim();
    if (!title) return;

    const projectData = {
      title,
      category: String(projectForm.category || "").trim() || "Uncategorized",
      description: String(projectForm.description || "").trim(),
      fullDescription: String(projectForm.fullDescription || "").trim(),
      image: String(projectForm.image || "").trim(),
      tags: toList(projectForm.tags),
      features: toList(projectForm.features),
      technologies: toList(projectForm.technologies),
      year: String(projectForm.year || "").trim(),
      client: String(projectForm.client || "").trim(),
      liveUrl: String(projectForm.liveUrl || "").trim() || undefined,
      sourceCodeUrl: String(projectForm.sourceCodeUrl || "").trim() || undefined,
    };

    try {
      const apiUrl = getApiUrl();
      let response;
      if (editingProjectId) {
        // Update existing project
        response = await fetch(`${apiUrl}/api/projects/${editingProjectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        });
      } else {
        // Create new project
        response = await fetch(`${apiUrl}/api/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        });
      }

      if (!response.ok) {
        console.error('Failed to save project');
        return;
      }

      const savedProject = await response.json();
      const nextProjects = editingProjectId
        ? projects.map((project) =>
            project.id === editingProjectId ? { ...savedProject, id: savedProject.id } : project
          )
        : [...projects, { ...savedProject, id: savedProject.id }];

      setPortfolioProjects(nextProjects);
      setProjects(nextProjects);
      resetProjectForm();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleProjectEdit = (project: PortfolioProject) => {
    setEditingProjectId(project.id);
    // Ensure all fields are properly populated, including API fields
    setProjectForm({
      title: project.title || "",
      category: project.category || "",
      description: project.description || "",
      fullDescription: project.fullDescription || "",
      image: project.image || "",
      tags: Array.isArray(project.tags) ? project.tags.join(", ") : (typeof project.tags === 'string' ? project.tags : ""),
      features: Array.isArray(project.features) ? project.features.join(", ") : (typeof project.features === 'string' ? project.features : ""),
      technologies: Array.isArray(project.technologies) ? project.technologies.join(", ") : (typeof project.technologies === 'string' ? project.technologies : ""),
      year: String(project.year || ""),
      client: project.client || "",
      liveUrl: project.liveUrl || "",
      sourceCodeUrl: project.sourceCodeUrl || "",
    });
    
    // Use image as-is (Cloudinary URLs or base64 data)
    // No conversion needed anymore since we store Cloudinary URLs in DB
  };

  const handleProjectImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadMessage("Uploading image to Cloudinary...");
    try {
      // Use project title as the image name (sanitized)
      const projectName = String(projectForm.title || "").trim().replace(/[^a-z0-9]/gi, '-').toLowerCase();
      const cloudinaryUrl = await uploadImage(file, 'netcraft-studio/projects', projectName);
      
      if (cloudinaryUrl) {
        setProjectForm((prev) => ({
          ...prev,
          image: cloudinaryUrl,
        }));
        setUploadMessage(`Image uploaded to Cloudinary successfully! Now web-accessible.`);
        setTimeout(() => setUploadMessage(null), 5000);
      } else {
        setUploadMessage(`Upload failed: ${uploadError}`);
        setTimeout(() => setUploadMessage(null), 3000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setUploadMessage(`Upload failed: ${errorMessage}`);
      setTimeout(() => setUploadMessage(null), 3000);
    }
  };

  const handleProjectDelete = async (projectId: number) => {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.error('Failed to delete project');
        return;
      }

      const nextProjects = projects.filter((project) => project.id !== projectId);
      setPortfolioProjects(nextProjects);
      setProjects(nextProjects);
      if (editingProjectId === projectId) {
        resetProjectForm();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleClientSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const name = String(clientForm.name || "").trim();
    if (!name) return;

    const clientData = {
      name,
      image: String(clientForm.image || "").trim(),
      alt: String(clientForm.alt || "").trim() || name,
    };

    try {
      const apiUrl = getApiUrl();
      let response;
      if (editingClientId) {
        // Update existing client
        response = await fetch(`${apiUrl}/api/clients/${editingClientId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clientData),
        });
      } else {
        // Create new client
        response = await fetch(`${apiUrl}/api/clients`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clientData),
        });
      }

      if (!response.ok) {
        console.error('Failed to save client');
        return;
      }

      const savedClient = await response.json();
      const nextClients = editingClientId
        ? clients.map((client) =>
            client.id === editingClientId ? { ...savedClient, id: savedClient.id } : client
          )
        : [...clients, { ...savedClient, id: savedClient.id }];

      setClients(nextClients);
      setClientList(nextClients);
      resetClientForm();
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handleClientEdit = (client: Client) => {
    setEditingClientId(client.id);
    setClientForm({
      name: client.name,
      image: client.image,
      alt: client.alt ?? "",
    });
    
    // Use image as-is (Cloudinary URLs or base64 data)
    // No conversion needed anymore since we store Cloudinary URLs in DB
  };

  const handleClientImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadMessage("Uploading image to Cloudinary...");
    try {
      // Use client name as the image name (sanitized)
      const clientName = String(clientForm.name || "").trim().replace(/[^a-z0-9]/gi, '-').toLowerCase();
      const cloudinaryUrl = await uploadImage(file, 'netcraft-studio/clients', clientName);
      
      if (cloudinaryUrl) {
        setClientForm((prev) => ({
          ...prev,
          image: cloudinaryUrl,
        }));
        setUploadMessage(`Image uploaded to Cloudinary successfully! Now web-accessible.`);
        setTimeout(() => setUploadMessage(null), 5000);
      } else {
        setUploadMessage(`Upload failed: ${uploadError}`);
        setTimeout(() => setUploadMessage(null), 3000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setUploadMessage(`Upload failed: ${errorMessage}`);
      setTimeout(() => setUploadMessage(null), 3000);
    }
  };

  const handleClientDelete = async (clientId: number) => {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/clients/${clientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.error('Failed to delete client');
        return;
      }

      const nextClients = clients.filter((client) => client.id !== clientId);
      setClients(nextClients);
      setClientList(nextClients);
      if (editingClientId === clientId) {
        resetClientForm();
      }
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden">
        <div className="noise-overlay" />
        <Navigation />

        <main className="container mx-auto px-4 sm:px-6 pt-28 pb-16">
          <div className="gta-card max-w-md mx-auto p-6 space-y-4">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-display font-black">Admin Access</h1>
              <p className="text-sm text-muted-foreground font-body">
                Enter the admin password to continue.
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={passwordInput}
                  onChange={(event) => {
                    setPasswordInput(event.target.value);
                    if (authError) setAuthError("");
                  }}
                  placeholder="Enter password"
                  required
                />
              </div>
              {authError ? (
                <p className="text-sm text-destructive" role="alert">
                  {authError}
                </p>
              ) : null}
              <Button type="submit" className="w-full">
                Unlock Admin
              </Button>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="noise-overlay" />
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 pt-28 pb-16 space-y-16">
        <section className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-display font-black gta-title">
                Admin Dashboard
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground font-body">
                Manage portfolio projects and client logos. Changes are saved in this
                browser.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
            <div className="gta-card p-6 space-y-4">
              <h2 className="text-xl font-display font-bold">Projects</h2>
              <div className="space-y-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/30"
                  >
                    <div className="space-y-1">
                      <p className="font-display text-base text-foreground">
                        {project.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {project.category} • {project.client || "No client"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleProjectEdit(project)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => handleProjectDelete(project.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleProjectSubmit}
              className="gta-card p-6 space-y-4"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-display font-bold">
                  {editingProjectId ? "Edit Project" : "Add Project"}
                </h2>
                <Button type="button" variant="outline" onClick={resetProjectForm}>
                  Clear
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="project-title">Title</Label>
                  <Input
                    id="project-title"
                    value={projectForm.title}
                    onChange={(event) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                    placeholder="Project title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-category">Category</Label>
                  <Input
                    id="project-category"
                    value={projectForm.category}
                    onChange={(event) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        category: event.target.value,
                      }))
                    }
                    placeholder="Web, Mobile, ..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-client">Client</Label>
                  <Input
                    id="project-client"
                    value={projectForm.client}
                    onChange={(event) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        client: event.target.value,
                      }))
                    }
                    placeholder="Client name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-year">Year</Label>
                  <Input
                    id="project-year"
                    value={projectForm.year}
                    onChange={(event) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        year: event.target.value,
                      }))
                    }
                    placeholder="2025"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="project-image">Image URL</Label>
                  <Input
                    id="project-image"
                    value={projectForm.image}
                    onChange={(event) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        image: event.target.value,
                      }))
                    }
                    placeholder="/portfolio/example.png or data:image/..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Use a public URL, /img/... from public folder, or upload base64 image below.
                  </p>
                  {projectForm.image ? (
                    <div className="mt-2 rounded-lg border border-border/50 bg-muted/20 p-2">
                      <img
                        src={projectForm.image}
                        alt="Project preview"
                        className="h-24 w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="project-image-upload">Upload Image</Label>
                  <Input
                    id="project-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProjectImageUpload}
                    disabled={isUploading}
                  />
                  {isUploading && <p className="text-sm text-blue-500">Uploading image...</p>}
                  {uploadMessage && <p className="text-sm text-green-500">{uploadMessage}</p>}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="project-description">Short Description</Label>
                  <Textarea
                    id="project-description"
                    value={projectForm.description}
                    onChange={(event) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Brief summary"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="project-full-description">Full Description</Label>
                  <Textarea
                    id="project-full-description"
                    value={projectForm.fullDescription}
                    onChange={(event) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        fullDescription: event.target.value,
                      }))
                    }
                    placeholder="Detailed description"
                    rows={5}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="project-tags">Tags (comma separated)</Label>
                  <Input
                    id="project-tags"
                    value={projectForm.tags}
                    onChange={(event) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        tags: event.target.value,
                      }))
                    }
                    placeholder="React, Node.js"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="project-features">Features (comma separated)</Label>
                  <Textarea
                    id="project-features"
                    value={projectForm.features}
                    onChange={(event) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        features: event.target.value,
                      }))
                    }
                    placeholder="Feature one, Feature two"
                    rows={3}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="project-technologies">
                    Technologies (comma separated)
                  </Label>
                  <Textarea
                    id="project-technologies"
                    value={projectForm.technologies}
                    onChange={(event) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        technologies: event.target.value,
                      }))
                    }
                    placeholder="React, Supabase"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-live-url">Live URL</Label>
                  <Input
                    id="project-live-url"
                    value={projectForm.liveUrl}
                    onChange={(event) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        liveUrl: event.target.value,
                      }))
                    }
                    placeholder="https://"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-source-url">Source URL</Label>
                  <Input
                    id="project-source-url"
                    value={projectForm.sourceCodeUrl}
                    onChange={(event) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        sourceCodeUrl: event.target.value,
                      }))
                    }
                    placeholder="https://"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editingProjectId ? "Update Project" : "Add Project"}
              </Button>
            </form>

          </div>
        </section>

        <section className="space-y-6">
          <div className="grid grid-cols-1 gap-8">
            <div className="gta-card p-6 space-y-4">
              <h2 className="text-xl font-display font-bold">Clients</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/30"
                  >
                    <div className="space-y-1">
                      <p className="font-display text-base text-foreground">
                        {client.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {client.alt || "No alt text"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleClientEdit(client)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => handleClientDelete(client.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleClientSubmit}
              className="gta-card p-6 space-y-4"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-display font-bold">
                  {editingClientId ? "Edit Client" : "Add Client"}
                </h2>
                <Button type="button" variant="outline" onClick={resetClientForm}>
                  Clear
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Name</Label>
                  <Input
                    id="client-name"
                    value={clientForm.name}
                    onChange={(event) =>
                      setClientForm((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Client name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-image">Logo URL</Label>
                  <Input
                    id="client-image"
                    value={clientForm.image}
                    onChange={(event) =>
                      setClientForm((prev) => ({
                        ...prev,
                        image: event.target.value,
                      }))
                    }
                    placeholder="/clients/logo.png or data:image/..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Use a public URL, /img/clients/... from public folder, or upload base64 image below.
                  </p>
                  {clientForm.image ? (
                    <div className="mt-2 rounded-lg border border-border/50 bg-muted/20 p-2">
                      <img
                        src={clientForm.image}
                        alt="Client logo preview"
                        className="h-20 w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-image-upload">Upload Logo</Label>
                  <Input
                    id="client-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleClientImageUpload}
                    disabled={isUploading}
                  />
                  {isUploading && <p className="text-sm text-blue-500">Uploading image...</p>}
                  {uploadMessage && <p className="text-sm text-green-500">{uploadMessage}</p>}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="client-alt">Alt Text</Label>
                  <Input
                    id="client-alt"
                    value={clientForm.alt}
                    onChange={(event) =>
                      setClientForm((prev) => ({
                        ...prev,
                        alt: event.target.value,
                      }))
                    }
                    placeholder="Accessible description"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editingClientId ? "Update Client" : "Add Client"}
              </Button>
            </form>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Admin;
