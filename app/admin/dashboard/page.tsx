"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Project { _id?: string; title: string; category: string; image: string; link: string; stats: { likes: string; views: string }; order: number; }
interface Education { _id?: string; degree: string; short: string; year: string; status?: string; statusType: 'done' | 'current' | 'future'; icon: string; schoolName: string; schoolShort: string; location: string; order: number; }
interface Gear { _id?: string; name: string; subtitle: string; description: string; icon: string; tags: string[]; order: number; }
interface Feedback { _id?: string; name: string; role: string; brand: string; text: string; avatar: string; workImage: string; metric: string; order: number; }
interface Skill { _id?: string; title: string; image: string; order: number; }
interface Course { _id?: string; title: string; image: string; order: number; }
interface Settings { _id?: string; heroTitle: string; heroSubTitle: string; heroDescription: string; heroImage: string; stats: { label: string; value: string }[]; socials: { platform: string; url: string }[]; contactEmail: string; contactPhone: string; contactAddress: string; aboutImage: string; languages: string; heroBadgeText: string; heroBadgeShow: boolean; }

const emptyProject: Project = { title: "", category: "", image: "", link: "", stats: { likes: "0", views: "0" }, order: 0 };
const emptyEducation: Education = { degree: "", short: "", year: "", status: "", statusType: "done", icon: "graduation", schoolName: "", schoolShort: "", location: "", order: 0 };
const emptyGear: Gear = { name: "", subtitle: "", description: "", icon: "iphone", tags: [], order: 0 };
const emptyFeedback: Feedback = { name: "", role: "", brand: "", text: "", avatar: "", workImage: "", metric: "", order: 0 };
const emptySkill: Skill = { title: "", image: "", order: 0 };
const emptyCourse: Course = { title: "", image: "", order: 0 };
const emptySettings: Settings = { heroTitle: "", heroSubTitle: "", heroDescription: "", heroImage: "", stats: [], socials: [], contactEmail: "", contactPhone: "", contactAddress: "", aboutImage: "", languages: "", heroBadgeText: "", heroBadgeShow: false };

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<"projects" | "education" | "gear" | "feedback" | "skills" | "courses" | "settings">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [gear, setGear] = useState<Gear[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [settings, setSettings] = useState<Settings>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>(emptyProject);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  
  const [securityData, setSecurityData] = useState({ currentUsername: "", currentPassword: "", newUsername: "", newPassword: "" });
  const [securityMsg, setSecurityMsg] = useState("");
  const [securityLoading, setSecurityLoading] = useState(false);

  function getToken() {
    return typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  }

  function authHeaders() {
    return { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` };
  }

  const fetchData = useCallback(async () => {
    setLoading(true);
    setMsg("");
    try {
      const urls = ["/api/projects", "/api/education", "/api/gear", "/api/feedback", "/api/skills", "/api/courses", "/api/settings"];
      const responses = await Promise.all(urls.map(u => fetch(u, { headers: authHeaders() })));
      const data = await Promise.all(responses.map(r => r.json()));

      setProjects(Array.isArray(data[0]) ? data[0] : []);
      setEducation(Array.isArray(data[1]) ? data[1] : []);
      setGear(Array.isArray(data[2]) ? data[2] : []);
      setFeedback(Array.isArray(data[3]) ? data[3] : []);
      setSkills(Array.isArray(data[4]) ? data[4] : []);
      setCourses(Array.isArray(data[5]) ? data[5] : []);
      if (data[6] && !data[6].error) setSettings(data[6]);
      
    } catch (err) {
      setMsg("Connection error: Failed to reach the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/admin"); return; }
    fetchData();
  }, [fetchData, router]);

  useEffect(() => {
    if (tab === "settings") {
      setFormData({ ...emptySettings, ...settings });
    }
  }, [tab, settings]);

  function logout() {
    localStorage.removeItem("admin_token");
    router.push("/admin");
  }

  function openAdd() {
    setEditItem(null);
    let empty = {};
    if (tab === "projects") empty = emptyProject;
    else if (tab === "education") empty = emptyEducation;
    else if (tab === "gear") empty = emptyGear;
    else if (tab === "feedback") empty = emptyFeedback;
    else if (tab === "skills") empty = emptySkill;
    else if (tab === "courses") empty = emptyCourse;
    setFormData({ ...empty });
    setShowForm(true);
  }

  function openEdit(item: any) {
    setEditItem(item);
    let empty = {};
    if (tab === "projects") empty = emptyProject;
    else if (tab === "education") empty = emptyEducation;
    else if (tab === "gear") empty = emptyGear;
    else if (tab === "feedback") empty = emptyFeedback;
    else if (tab === "skills") empty = emptySkill;
    else if (tab === "courses") empty = emptyCourse;
    setFormData({ ...empty, ...item });
    setShowForm(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, fieldName: string) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg("Uploading...");
    const uploadData = new FormData();
    uploadData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: uploadData
      });
      const data = await res.json();
      if (res.ok) {
        setFormData((prev: any) => ({ ...prev, [fieldName]: data.url }));
        setMsg("Uploaded!");
      } else {
        setMsg(data.error || "Upload failed");
      }
    } catch {
      setMsg("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMsg("");
    const base = `/api/${tab}`;
    const id = editItem?._id;
    try {
      const res = await fetch(id ? `${base}/${id}` : base, {
        method: id ? "PUT" : "POST",
        headers: authHeaders(),
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setMsg("Saved!");
        setShowForm(false);
        fetchData();
      } else {
        const d = await res.json();
        setMsg(d.error || "Error saving");
      }
    } catch {
      setMsg("Connection error.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this?")) return;
    await fetch(`/api/${tab}/${id}`, { method: "DELETE", headers: authHeaders() });
    fetchData();
  }

  async function handleSecurityUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSecurityLoading(true);
    setSecurityMsg("");
    try {
      const res = await fetch("/api/admin/change-credentials", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(securityData),
      });
      const data = await res.json();
      if (res.ok) {
        setSecurityMsg("Credentials updated!");
        setSecurityData({ currentUsername: "", currentPassword: "", newUsername: "", newPassword: "" });
      } else {
        setSecurityMsg(data.error || "Update failed");
      }
    } catch {
      setSecurityMsg("Connection failed");
    } finally {
      setSecurityLoading(false);
    }
  }

  const getItems = () => {
    if (tab === "projects") return projects;
    if (tab === "education") return education;
    if (tab === "gear") return gear;
    if (tab === "feedback") return feedback;
    if (tab === "skills") return skills;
    if (tab === "courses") return courses;
    return [];
  };

  const navItems = [
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "feedback", label: "Feedback" },
    { id: "courses", label: "Courses" },
    { id: "education", label: "Education" },
    { id: "gear", label: "Pricing" },
    { id: "settings", label: "Settings" },
  ];

  // STYLES
  const headerStyle: React.CSSProperties = {
    background: "#000", color: "#fff", padding: "1.5rem 2rem", display: "flex",
    justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100
  };

  const tabButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: "0.8rem 1.5rem", borderRadius: 0, border: "none", 
    background: active ? "#000" : "#f5f5f5",
    color: active ? "#fff" : "#000", 
    fontWeight: 700, cursor: "pointer", transition: "0.3s",
    fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em"
  });

  const cardStyle: React.CSSProperties = {
    background: "white", border: "1px solid #eee", padding: "1.2rem", display: "flex", gap: "1.2rem",
    alignItems: "center", position: "relative"
  };

  const inputStyle: React.CSSProperties = {
    padding: "0.85rem 1rem", border: "1px solid #ddd", borderRadius: 0,
    fontSize: "0.95rem", outline: "none", background: "white", width: "100%", color: "#000"
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em",
    color: "#888", marginBottom: "0.4rem"
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header style={headerStyle}>
        <div />
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <a href="/" target="_blank" style={{ color: "#888", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>View Site →</a>
          <button onClick={logout} style={{ padding: "0.6rem 1.2rem", background: "transparent", border: "1px solid #444", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "0.8rem" }}>Logout</button>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
        {/* Tab Selection */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "3rem", borderBottom: "1px solid #eee", paddingBottom: "1.5rem" }}>
          {navItems.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id as any); setShowForm(false); setMsg(""); }} style={tabButtonStyle(tab === t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Section Title & Action */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em" }}>{tab}</h2>
          {tab !== "settings" && !showForm && (
            <button onClick={openAdd} style={{ padding: "0.8rem 1.8rem", background: "#000", color: "#fff", border: "none", fontWeight: 800, cursor: "pointer", fontSize: "0.85rem", textTransform: "uppercase" }}>+ Add New</button>
          )}
        </div>

        {msg && <div style={{ padding: "1rem", background: "#000", color: "#fff", marginBottom: "2rem", fontWeight: 600, fontSize: "0.9rem" }}>{msg}</div>}

        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ 
              background: "#fff", border: "1px solid #000", padding: "3rem", marginBottom: "3rem"
            }}>
              <h3 style={{ marginTop: 0, marginBottom: "2rem", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "1rem" }}>{editItem ? `Edit ${tab}` : `New ${tab}`}</h3>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
                {tab === "projects" && <>
                  <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Title</label><input style={inputStyle} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} /></div>
                  <div><label style={labelStyle}>Category</label><input style={inputStyle} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} /></div>
                  <div><label style={labelStyle}>Link</label><input style={inputStyle} value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} /></div>
                  <div><label style={labelStyle}>Likes</label><input style={inputStyle} value={formData.stats.likes} onChange={e => setFormData({ ...formData, stats: { ...formData.stats, likes: e.target.value } })} /></div>
                  <div><label style={labelStyle}>Views</label><input style={inputStyle} value={formData.stats.views} onChange={e => setFormData({ ...formData, stats: { ...formData.stats, views: e.target.value } })} /></div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Image URL</label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input style={inputStyle} value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                      <label style={{ padding: "0 1.5rem", background: "#f0f0f0", display: "flex", alignItems: "center", cursor: "pointer", fontWeight: 800, fontSize: "0.75rem" }}>
                        UPLOAD <input type="file" hidden onChange={e => handleFileUpload(e, 'image')} />
                      </label>
                    </div>
                  </div>
                </>}

                {tab === "feedback" && <>
                  <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Client Name</label><input style={inputStyle} value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
                  <div><label style={labelStyle}>Service Rendered</label><input style={inputStyle} value={formData.role || ""} onChange={e => setFormData({ ...formData, role: e.target.value })} /></div>
                  <div><label style={labelStyle}>Brand/Location</label><input style={inputStyle} value={formData.brand || ""} onChange={e => setFormData({ ...formData, brand: e.target.value })} /></div>
                  <div><label style={labelStyle}>Metric (e.g. 100k views)</label><input style={inputStyle} value={formData.metric || ""} onChange={e => setFormData({ ...formData, metric: e.target.value })} /></div>
                  <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Testimonial Content</label><textarea style={{ ...inputStyle, height: 100 }} value={formData.text || ""} onChange={e => setFormData({ ...formData, text: e.target.value })} /></div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Avatar URL</label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input style={inputStyle} value={formData.avatar} onChange={e => setFormData({ ...formData, avatar: e.target.value })} />
                      <label style={{ padding: "0 1.5rem", background: "#f0f0f0", display: "flex", alignItems: "center", cursor: "pointer", fontWeight: 800, fontSize: "0.75rem" }}>
                        UPLOAD <input type="file" hidden onChange={e => handleFileUpload(e, 'avatar')} />
                      </label>
                    </div>
                  </div>
                </>}

                {tab === "skills" && <>
                  <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Skill Title</label><input style={inputStyle} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} /></div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Icon URL</label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input style={inputStyle} value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                      <label style={{ padding: "0 1.5rem", background: "#f0f0f0", display: "flex", alignItems: "center", cursor: "pointer", fontWeight: 800, fontSize: "0.75rem" }}>
                        UPLOAD <input type="file" hidden onChange={e => handleFileUpload(e, 'image')} />
                      </label>
                    </div>
                  </div>
                </>}

                {tab === "education" && <>
                  <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Degree / Major</label><input style={inputStyle} value={formData.degree} onChange={e => setFormData({ ...formData, degree: e.target.value })} /></div>
                  <div><label style={labelStyle}>Year</label><input style={inputStyle} value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} /></div>
                  <div><label style={labelStyle}>Status Text</label><input style={inputStyle} value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} /></div>
                  <div>
                    <label style={labelStyle}>Status Type</label>
                    <select style={inputStyle} value={formData.statusType} onChange={e => setFormData({ ...formData, statusType: e.target.value })}>
                      <option value="done">Completed</option>
                      <option value="current">Ongoing</option>
                      <option value="future">Upcoming</option>
                    </select>
                  </div>
                  <div><label style={labelStyle}>School Name</label><input style={inputStyle} value={formData.schoolName} onChange={e => setFormData({ ...formData, schoolName: e.target.value })} /></div>
                  <div><label style={labelStyle}>Location</label><input style={inputStyle} value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} /></div>
                </>}

                {tab === "gear" && <>
                  <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Package Name</label><input style={inputStyle} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
                  <div><label style={labelStyle}>Subtitle</label><input style={inputStyle} value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} /></div>
                  <div>
                    <label style={labelStyle}>Icon Key</label>
                    <select style={inputStyle} value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })}>
                      <option value="iphone">iPhone</option>
                      <option value="macbook">MacBook</option>
                      <option value="camera">Camera</option>
                      <option value="mic">Microphone</option>
                      <option value="graduation">Education</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, height: 80 }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
                  <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Features (comma separated)</label><input style={inputStyle} value={formData.tags?.join(', ')} onChange={e => setFormData({ ...formData, tags: e.target.value.split(',').map(s => s.trim()) })} /></div>
                </>}

                {tab === "courses" && <>
                  <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Course Title</label><input style={inputStyle} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} /></div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Thumbnail URL</label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input style={inputStyle} value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                      <label style={{ padding: "0 1.5rem", background: "#f0f0f0", display: "flex", alignItems: "center", cursor: "pointer", fontWeight: 800, fontSize: "0.75rem" }}>
                        UPLOAD <input type="file" hidden onChange={e => handleFileUpload(e, 'image')} />
                      </label>
                    </div>
                  </div>
                </>}
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "3rem" }}>
                <button onClick={handleSave} disabled={saving || uploading} style={{ flex: 1, padding: "1rem", background: "#000", color: "#fff", border: "none", fontWeight: 800, cursor: "pointer", textTransform: "uppercase" }}>{saving ? "Saving..." : "Save Entry"}</button>
                <button onClick={() => setShowForm(false)} style={{ padding: "1rem 2.5rem", background: "transparent", border: "1px solid #ddd", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
              </div>
            </motion.div>
          ) : tab === "settings" ? (
            <div style={{ display: "grid", gap: "2rem" }}>
              <div style={{ background: "#f9f9f9", padding: "3rem", border: "1px solid #eee" }}>
                <h3 style={{ marginTop: 0, marginBottom: "2rem", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Site Configuration</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Hero Title</label><input style={inputStyle} value={formData.heroTitle} onChange={e => setFormData({ ...formData, heroTitle: e.target.value })} /></div>
                  <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Hero SubTitle</label><input style={inputStyle} value={formData.heroSubTitle} onChange={e => setFormData({ ...formData, heroSubTitle: e.target.value })} /></div>
                  <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Hero Description</label><textarea style={{ ...inputStyle, height: 100 }} value={formData.heroDescription} onChange={e => setFormData({ ...formData, heroDescription: e.target.value })} /></div>
                  
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Hero Image URL</label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input style={inputStyle} value={formData.heroImage} onChange={e => setFormData({ ...formData, heroImage: e.target.value })} />
                      <label style={{ padding: "0 1.5rem", background: "#f0f0f0", display: "flex", alignItems: "center", cursor: "pointer", fontWeight: 800, fontSize: "0.75rem" }}>
                        UPLOAD <input type="file" hidden onChange={e => handleFileUpload(e, 'heroImage')} />
                      </label>
                    </div>
                  </div>

                  <div><label style={labelStyle}>Hero Badge Text</label><input style={inputStyle} value={formData.heroBadgeText} onChange={e => setFormData({ ...formData, heroBadgeText: e.target.value })} /></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={labelStyle}>Show Badge</label>
                    <input type="checkbox" checked={formData.heroBadgeShow} onChange={e => setFormData({ ...formData, heroBadgeShow: e.target.checked })} />
                  </div>

                  <div><label style={labelStyle}>Contact Email</label><input style={inputStyle} value={formData.contactEmail} onChange={e => setFormData({ ...formData, contactEmail: e.target.value })} /></div>
                  <div><label style={labelStyle}>Contact Phone</label><input style={inputStyle} value={formData.contactPhone} onChange={e => setFormData({ ...formData, contactPhone: e.target.value })} /></div>
                  <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Contact Address</label><input style={inputStyle} value={formData.contactAddress} onChange={e => setFormData({ ...formData, contactAddress: e.target.value })} /></div>
                  
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>About Image URL</label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input style={inputStyle} value={formData.aboutImage} onChange={e => setFormData({ ...formData, aboutImage: e.target.value })} />
                      <label style={{ padding: "0 1.5rem", background: "#f0f0f0", display: "flex", alignItems: "center", cursor: "pointer", fontWeight: 800, fontSize: "0.75rem" }}>
                        UPLOAD <input type="file" hidden onChange={e => handleFileUpload(e, 'aboutImage')} />
                      </label>
                    </div>
                  </div>
                  
                  <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Languages (comma separated)</label><input style={inputStyle} value={formData.languages} onChange={e => setFormData({ ...formData, languages: e.target.value })} /></div>

                  {/* Stats Management */}
                  <div style={{ gridColumn: "1 / -1", marginTop: "2rem" }}>
                    <h4 style={{ fontSize: "0.8rem", textTransform: "uppercase", marginBottom: "1rem" }}>Counter Stats</h4>
                    {Array.isArray(formData.stats) && formData.stats.map((stat: any, idx: number) => (
                      <div key={idx} style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
                        <input style={inputStyle} placeholder="Label" value={stat.label} onChange={e => {
                          const newStats = [...formData.stats];
                          newStats[idx].label = e.target.value;
                          setFormData({ ...formData, stats: newStats });
                        }} />
                        <input style={inputStyle} placeholder="Value" value={stat.value} onChange={e => {
                          const newStats = [...formData.stats];
                          newStats[idx].value = e.target.value;
                          setFormData({ ...formData, stats: newStats });
                        }} />
                        <button onClick={() => {
                          const newStats = formData.stats.filter((_: any, i: number) => i !== idx);
                          setFormData({ ...formData, stats: newStats });
                        }} style={{ padding: "0.5rem 1rem", background: "#fee2e2", color: "#c53030", border: "none", cursor: "pointer", fontWeight: 700 }}>X</button>
                      </div>
                    ))}
                    <button onClick={() => setFormData({ ...formData, stats: [...(formData.stats || []), { label: "", value: "" }] })} style={{ marginTop: "0.5rem", padding: "0.5rem 1rem", background: "#f0f0f0", border: "none", cursor: "pointer", fontWeight: 700 }}>+ Add Stat</button>
                  </div>

                  {/* Socials Management */}
                  <div style={{ gridColumn: "1 / -1", marginTop: "1rem" }}>
                    <h4 style={{ fontSize: "0.8rem", textTransform: "uppercase", marginBottom: "1rem" }}>Social Links</h4>
                    {Array.isArray(formData.socials) && formData.socials.map((social: any, idx: number) => (
                      <div key={idx} style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
                        <input style={inputStyle} placeholder="Platform" value={social.platform} onChange={e => {
                          const newSocials = [...formData.socials];
                          newSocials[idx].platform = e.target.value;
                          setFormData({ ...formData, socials: newSocials });
                        }} />
                        <input style={inputStyle} placeholder="URL" value={social.url} onChange={e => {
                          const newSocials = [...formData.socials];
                          newSocials[idx].url = e.target.value;
                          setFormData({ ...formData, socials: newSocials });
                        }} />
                        <button onClick={() => {
                          const newSocials = formData.socials.filter((_: any, i: number) => i !== idx);
                          setFormData({ ...formData, socials: newSocials });
                        }} style={{ padding: "0.5rem 1rem", background: "#fee2e2", color: "#c53030", border: "none", cursor: "pointer", fontWeight: 700 }}>X</button>
                      </div>
                    ))}
                    <button onClick={() => setFormData({ ...formData, socials: [...(formData.socials || []), { platform: "", url: "" }] })} style={{ marginTop: "0.5rem", padding: "0.5rem 1rem", background: "#f0f0f0", border: "none", cursor: "pointer", fontWeight: 700 }}>+ Add Social</button>
                  </div>
                </div>
                <button onClick={handleSave} disabled={saving} style={{ marginTop: "2rem", width: "100%", padding: "1rem", background: "#000", color: "#fff", border: "none", fontWeight: 800, textTransform: "uppercase", cursor: "pointer" }}>Save Global Settings</button>
              </div>

              <div style={{ background: "#000", color: "#fff", padding: "3rem" }}>
                <h3 style={{ marginTop: 0, marginBottom: "2rem", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Security</h3>
                <form onSubmit={handleSecurityUpdate} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div><label style={{ ...labelStyle, color: "#666" }}>New User</label><input style={{ ...inputStyle, background: "#111", border: "1px solid #333", color: "#fff" }} value={securityData.newUsername} onChange={e => setSecurityData({ ...securityData, newUsername: e.target.value })} /></div>
                  <div><label style={{ ...labelStyle, color: "#666" }}>New Pass</label><input type="password" style={{ ...inputStyle, background: "#111", border: "1px solid #333", color: "#fff" }} value={securityData.newPassword} onChange={e => setSecurityData({ ...securityData, newPassword: e.target.value })} /></div>
                  <div style={{ gridColumn: "1 / -1" }}><label style={{ ...labelStyle, color: "#666" }}>Current Pass</label><input type="password" style={{ ...inputStyle, background: "#111", border: "1px solid #333", color: "#fff" }} value={securityData.currentPassword} onChange={e => setSecurityData({ ...securityData, currentPassword: e.target.value })} /></div>
                  <button type="submit" disabled={securityLoading} style={{ gridColumn: "1 / -1", padding: "1rem", background: "#fff", color: "#000", border: "none", fontWeight: 800, textTransform: "uppercase", cursor: "pointer" }}>Update Credentials</button>
                </form>
                {securityMsg && <p style={{ marginTop: "1rem", fontSize: "0.85rem", fontWeight: 700 }}>{securityMsg}</p>}
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "grid", gap: "0.8rem" }}>
              {getItems().map((item: any) => (
                <div key={item._id} style={cardStyle}>
                  <div style={{ width: 60, height: 60, background: "#f5f5f5", overflow: "hidden", flexShrink: 0 }}>
                    {(item.image || item.avatar || item.workImage) && <img src={item.image || item.avatar || item.workImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title || item.name || item.degree}</h4>
                    <p style={{ margin: "0.2rem 0 0", fontSize: "0.75rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.category || item.role || item.schoolName || item.subtitle}</p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => openEdit(item)} style={{ padding: "0.6rem 1.2rem", background: "#f5f5f5", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "0.75rem" }}>EDIT</button>
                    <button onClick={() => handleDelete(item._id)} style={{ padding: "0.6rem 1.2rem", background: "#000", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "0.75rem" }}>DELETE</button>
                  </div>
                </div>
              ))}
              {getItems().length === 0 && !loading && (
                <div style={{ padding: "5rem", textAlign: "center", border: "1px dashed #eee", color: "#aaa", fontSize: "0.9rem" }}>No items found. Click "+ Add New" to create one.</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {loading && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, fontWeight: 900, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.3em" }}>Processing...</div>
      )}
    </div>
  );
}
