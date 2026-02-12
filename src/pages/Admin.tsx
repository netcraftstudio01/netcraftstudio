import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getClients,
  getPortfolioProjects,
  getTeamMembers,
  setClients,
  setPortfolioProjects,
  setTeamMembers,
  type Client,
  type PortfolioProject,
  type TeamMember,
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

const emptyTeamForm = {
  name: "",
  role: "",
  image: "",
};

const ADMIN_PASSWORD = "Netcraft@2005";

const toList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const getNextId = (items: Array<{ id: number }>) =>
  Math.max(0, ...items.map((item) => item.id)) + 1;

const Admin = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [projects, setProjects] = useState<PortfolioProject[]>(() =>
    getPortfolioProjects()
  );
  const [clients, setClientList] = useState<Client[]>(() => getClients());
  const [teamMembers, setTeamMembersList] = useState<TeamMember[]>(() =>
    getTeamMembers()
  );
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editingClientId, setEditingClientId] = useState<number | null>(null);
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [clientForm, setClientForm] = useState(emptyClientForm);
  const [teamForm, setTeamForm] = useState(emptyTeamForm);

  useEffect(() => {
    const updateData = () => {
      setProjects(getPortfolioProjects());
      setClientList(getClients());
      setTeamMembersList(getTeamMembers());
    };

    updateData();
    window.addEventListener("ncs-data-updated", updateData);
    window.addEventListener("storage", updateData);

    return () => {
      window.removeEventListener("ncs-data-updated", updateData);
      window.removeEventListener("storage", updateData);
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

  const resetTeamForm = () => {
    setEditingTeamId(null);
    setTeamForm(emptyTeamForm);
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

  const handleProjectSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!projectForm.title.trim()) return;

    const updatedProject: PortfolioProject = {
      id:
        editingProjectId ??
        getNextId(projects.length ? projects : [{ id: 0 }]),
      title: projectForm.title.trim(),
      category: projectForm.category.trim() || "Uncategorized",
      description: projectForm.description.trim(),
      fullDescription: projectForm.fullDescription.trim(),
      image: projectForm.image.trim(),
      tags: toList(projectForm.tags),
      features: toList(projectForm.features),
      technologies: toList(projectForm.technologies),
      year: projectForm.year.trim(),
      client: projectForm.client.trim(),
      liveUrl: projectForm.liveUrl.trim() || undefined,
      sourceCodeUrl: projectForm.sourceCodeUrl.trim() || undefined,
    };

    const nextProjects = editingProjectId
      ? projects.map((project) =>
          project.id === editingProjectId ? updatedProject : project
        )
      : [...projects, updatedProject];

    setPortfolioProjects(nextProjects);
    setProjects(nextProjects);
    resetProjectForm();
  };

  const handleProjectEdit = (project: PortfolioProject) => {
    setEditingProjectId(project.id);
    setProjectForm({
      title: project.title,
      category: project.category,
      description: project.description,
      fullDescription: project.fullDescription,
      image: project.image,
      tags: project.tags.join(", "),
      features: project.features.join(", "),
      technologies: project.technologies.join(", "),
      year: project.year,
      client: project.client,
      liveUrl: project.liveUrl ?? "",
      sourceCodeUrl: project.sourceCodeUrl ?? "",
    });
  };

  const handleProjectImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") return;
      setProjectForm((prev) => ({
        ...prev,
        image: result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleProjectDelete = (projectId: number) => {
    const nextProjects = projects.filter((project) => project.id !== projectId);
    setPortfolioProjects(nextProjects);
    setProjects(nextProjects);
    if (editingProjectId === projectId) {
      resetProjectForm();
    }
  };

  const handleClientSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!clientForm.name.trim()) return;

    const updatedClient: Client = {
      id: editingClientId ?? getNextId(clients.length ? clients : [{ id: 0 }]),
      name: clientForm.name.trim(),
      image: clientForm.image.trim(),
      alt: clientForm.alt.trim() || clientForm.name.trim(),
    };

    const nextClients = editingClientId
      ? clients.map((client) =>
          client.id === editingClientId ? updatedClient : client
        )
      : [...clients, updatedClient];

    setClients(nextClients);
    setClientList(nextClients);
    resetClientForm();
  };

  const handleClientEdit = (client: Client) => {
    setEditingClientId(client.id);
    setClientForm({
      name: client.name,
      image: client.image,
      alt: client.alt ?? "",
    });
  };

  const handleClientImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") return;
      setClientForm((prev) => ({
        ...prev,
        image: result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleClientDelete = (clientId: number) => {
    const nextClients = clients.filter((client) => client.id !== clientId);
    setClients(nextClients);
    setClientList(nextClients);
    if (editingClientId === clientId) {
      resetClientForm();
    }
  };

  const handleTeamSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!teamForm.name.trim()) return;

    const updatedMember: TeamMember = {
      id: editingTeamId ?? getNextId(teamMembers.length ? teamMembers : [{ id: 0 }]),
      name: teamForm.name.trim(),
      role: teamForm.role.trim() || "Team Member",
      image: teamForm.image.trim(),
    };

    const nextTeam = editingTeamId
      ? teamMembers.map((member) =>
          member.id === editingTeamId ? updatedMember : member
        )
      : [...teamMembers, updatedMember];

    setTeamMembers(nextTeam);
    setTeamMembersList(nextTeam);
    resetTeamForm();
  };

  const handleTeamEdit = (member: TeamMember) => {
    setEditingTeamId(member.id);
    setTeamForm({
      name: member.name,
      role: member.role,
      image: member.image,
    });
  };

  const handleTeamImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") return;
      setTeamForm((prev) => ({
        ...prev,
        image: result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleTeamDelete = (memberId: number) => {
    const nextTeam = teamMembers.filter((member) => member.id !== memberId);
    setTeamMembers(nextTeam);
    setTeamMembersList(nextTeam);
    if (editingTeamId === memberId) {
      resetTeamForm();
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
                    placeholder="/portfolio/example.png"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use a public URL or /img/... from the public folder, or upload below.
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
                  />
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
                    placeholder="/clients/logo.png"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use a public URL or /img/... from the public folder, or upload below.
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
                  />
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

        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
            <div className="gta-card p-6 space-y-4">
              <h2 className="text-xl font-display font-bold">Meet the Team</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/30"
                  >
                    <div className="space-y-1">
                      <p className="font-display text-base text-foreground">
                        {member.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.role}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleTeamEdit(member)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => handleTeamDelete(member.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleTeamSubmit} className="gta-card p-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-display font-bold">
                  {editingTeamId ? "Edit Team Member" : "Add Team Member"}
                </h2>
                <Button type="button" variant="outline" onClick={resetTeamForm}>
                  Clear
                </Button>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">Name</Label>
                  <Input
                    id="team-name"
                    value={teamForm.name}
                    onChange={(event) =>
                      setTeamForm((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Team member name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-role">Role</Label>
                  <Input
                    id="team-role"
                    value={teamForm.role}
                    onChange={(event) =>
                      setTeamForm((prev) => ({
                        ...prev,
                        role: event.target.value,
                      }))
                    }
                    placeholder="Role / title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-image">Image URL</Label>
                  <Input
                    id="team-image"
                    value={teamForm.image}
                    onChange={(event) =>
                      setTeamForm((prev) => ({
                        ...prev,
                        image: event.target.value,
                      }))
                    }
                    placeholder="/src/assets/team/name.jpg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use a public URL or /img/... from the public folder, or upload below.
                  </p>
                  {teamForm.image ? (
                    <div className="mt-2 rounded-lg border border-border/50 bg-muted/20 p-2">
                      <img
                        src={teamForm.image}
                        alt="Team member preview"
                        className="h-24 w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-image-upload">Upload Image</Label>
                  <Input
                    id="team-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleTeamImageUpload}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editingTeamId ? "Update Member" : "Add Member"}
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
