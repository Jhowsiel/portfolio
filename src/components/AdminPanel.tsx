import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Plus,
  Trash,
  FloppyDisk,
  PencilSimple,
  Code,
  Desktop,
  Database,
  Lightning,
  DeviceMobile,
  Gear,
  Cpu,
  Eye,
  EyeSlash,
  LockKey,
  SignOut
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'

const ICON_OPTIONS = [
  { value: 'Code', label: 'Code', icon: Code },
  { value: 'Desktop', label: 'Desktop', icon: Desktop },
  { value: 'Database', label: 'Database', icon: Database },
  { value: 'Lightning', label: 'Lightning', icon: Lightning },
  { value: 'DeviceMobile', label: 'Device Mobile', icon: DeviceMobile },
  { value: 'Gear', label: 'Gear', icon: Gear },
  { value: 'Cpu', label: 'CPU', icon: Cpu }
]

const GRADIENT_OPTIONS = [
  { value: 'from-primary/30 via-accent/20 to-secondary/30', label: 'Verde Primary' },
  { value: 'from-accent/30 via-primary/20 to-secondary/30', label: 'Verde Accent' },
  { value: 'from-secondary/30 via-primary/20 to-accent/30', label: 'Verde Secondary' },
  { value: 'from-primary/30 via-secondary/20 to-accent/30', label: 'Verde Mix 1' },
  { value: 'from-accent/30 via-secondary/20 to-primary/30', label: 'Verde Mix 2' },
  { value: 'from-secondary/30 via-accent/20 to-primary/30', label: 'Verde Mix 3' }
]

interface Project {
  id: number
  title: string
  description: string
  fullDescription: string
  stack: string[]
  category: string
  icon: string
  gradient: string
  image: string
  repositoryUrl?: string
  demoUrl?: string
}

interface Skill {
  name: string
  level: number
  icon: string
}

interface SiteConfig {
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  whatsappNumber: string
  email: string
  github: string
  linkedin: string
  githubUsername?: string
  adminPassword?: string
  aboutTitle?: string
  aboutDescription?: string
  ctaTitle?: string
  ctaDescription?: string
  footerText?: string
}

interface AdminPanelProps {
  onClose: () => void
}

function hashPassword(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString(36)
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [authToken, setAuthToken] = useKV<string | null>('admin-auth-token', null)
  const [passwordInput, setPasswordInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [projects, setProjects] = useKV<Project[]>('admin-projects', [])
  const [skills, setSkills] = useKV<Skill[]>('admin-skills', [])
  const [siteConfig, setSiteConfig] = useKV<SiteConfig>('admin-site-config', {
    heroTitle: '',
    heroSubtitle: '',
    heroDescription: '',
    whatsappNumber: '',
    email: '',
    github: '',
    linkedin: '',
    githubUsername: '',
    aboutTitle: 'Sobre Mim',
    aboutDescription: 'Desenvolvedor apaixonado por tecnologia e inovação. Trabalho com desenvolvimento web moderno, programação Python para automação e projetos maker com Arduino. Estou sempre aprendendo e buscando novos desafios para expandir minhas habilidades.',
    ctaTitle: 'Vamos conversar?',
    ctaDescription: 'Estou disponível para conversar sobre projetos, tirar dúvidas ou falar sobre tecnologia',
    footerText: 'Desenvolvido com React, TypeScript e Framer Motion'
  })

  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [newProjectForm, setNewProjectForm] = useState(false)
  const [newSkillForm, setNewSkillForm] = useState(false)

  const config = siteConfig || {
    heroTitle: '',
    heroSubtitle: '',
    heroDescription: '',
    whatsappNumber: '',
    email: '',
    github: '',
    linkedin: '',
    githubUsername: '',
    aboutTitle: 'Sobre Mim',
    aboutDescription: 'Desenvolvedor apaixonado por tecnologia e inovação. Trabalho com desenvolvimento web moderno, programação Python para automação e projetos maker com Arduino. Estou sempre aprendendo e buscando novos desafios para expandir minhas habilidades.',
    ctaTitle: 'Vamos conversar?',
    ctaDescription: 'Estou disponível para conversar sobre projetos, tirar dúvidas ou falar sobre tecnologia',
    footerText: 'Desenvolvido com React, TypeScript e Framer Motion'
  }

  const isAuthenticated = config.adminPassword 
    ? authToken === config.adminPassword 
    : true

  const handleLogin = () => {
    if (!config.adminPassword) {
      setAuthToken(() => 'no-password-set')
      toast.success('Acesso liberado! Configure uma senha na aba Segurança.')
      return
    }

    const hashedInput = hashPassword(passwordInput)
    if (hashedInput === config.adminPassword) {
      setAuthToken(() => config.adminPassword!)
      setPasswordInput('')
      toast.success('Login realizado!')
    } else {
      toast.error('Senha incorreta.')
      setPasswordInput('')
    }
  }

  const handleLogout = () => {
    setAuthToken(() => null)
    setPasswordInput('')
    toast.info('Sessão encerrada.')
  }

  const handleSetPassword = () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem.')
      return
    }

    const hashedPassword = hashPassword(newPassword)
    setSiteConfig((prev) => {
      const current = prev || {
        heroTitle: '',
        heroSubtitle: '',
        heroDescription: '',
        whatsappNumber: '',
        email: '',
        github: '',
        linkedin: '',
        githubUsername: '',
        aboutTitle: 'Sobre Mim',
        aboutDescription: '',
        ctaTitle: 'Vamos conversar?',
        ctaDescription: '',
        footerText: 'Desenvolvido com React, TypeScript e Framer Motion'
      }
      return {
        ...current,
        adminPassword: hashedPassword
      }
    })

    setAuthToken(() => hashedPassword)
    setNewPassword('')
    setConfirmPassword('')
    toast.success('Senha configurada!')
  }

  const handleRemovePassword = () => {
    setSiteConfig((prev) => {
      const current = prev || {
        heroTitle: '',
        heroSubtitle: '',
        heroDescription: '',
        whatsappNumber: '',
        email: '',
        github: '',
        linkedin: '',
        githubUsername: '',
        aboutTitle: 'Sobre Mim',
        aboutDescription: '',
        ctaTitle: 'Vamos conversar?',
        ctaDescription: '',
        footerText: 'Desenvolvido com React, TypeScript e Framer Motion'
      }
      const { adminPassword, ...updated } = current
      return updated
    })
    setAuthToken(() => null)
    toast.success('Senha removida.')
  }

  const handleSaveProject = (project: Project) => {
    if (project.id === 0) {
      const newProject = { ...project, id: Date.now() }
      setProjects((current) => [...(current || []), newProject])
      toast.success('Projeto adicionado com sucesso!')
    } else {
      setProjects((current) =>
        (current || []).map((p) => (p.id === project.id ? project : p))
      )
      toast.success('Projeto atualizado com sucesso!')
    }
    setEditingProject(null)
    setNewProjectForm(false)
  }

  const handleDeleteProject = (id: number) => {
    setProjects((current) => (current || []).filter((p) => p.id !== id))
    toast.success('Projeto removido com sucesso!')
  }

  const handleSaveSkill = (skill: Skill) => {
    const existingIndex = (skills || []).findIndex((s) => s.name === skill.name)
    if (existingIndex >= 0) {
      setSkills((current) =>
        (current || []).map((s, i) => (i === existingIndex ? skill : s))
      )
      toast.success('Habilidade atualizada com sucesso!')
    } else {
      setSkills((current) => [...(current || []), skill])
      toast.success('Habilidade adicionada com sucesso!')
    }
    setEditingSkill(null)
    setNewSkillForm(false)
  }

  const handleDeleteSkill = (name: string) => {
    setSkills((current) => (current || []).filter((s) => s.name !== name))
    toast.success('Habilidade removida com sucesso!')
  }

  const handleSaveConfig = () => {
    toast.success('Configurações salvas!')
  }

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          <Card className="border-primary/40">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <LockKey className="h-8 w-8 text-primary" weight="bold" />
              </div>
              <CardTitle className="text-2xl">Acesso Restrito</CardTitle>
              <CardDescription>
                Digite a senha do administrador
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    placeholder="Digite a senha"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeSlash className="h-4 w-4" weight="bold" />
                    ) : (
                      <Eye className="h-4 w-4" weight="bold" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleLogin} className="flex-1">
                  Acessar
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto"
    >
      <div className="container max-w-6xl mx-auto p-4 sm:p-6 min-h-screen">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Painel de Controle
            </h1>
            <p className="text-muted-foreground mt-1">Configure seu portfólio</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <SignOut className="h-4 w-4" weight="bold" />
              Sair
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-10 w-10 rounded-full"
            >
              <X className="h-5 w-5" weight="bold" />
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="projects">Projetos</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Projetos</h2>
              <Button
                onClick={() => {
                  setNewProjectForm(true)
                  setEditingProject({
                    id: 0,
                    title: '',
                    description: '',
                    fullDescription: '',
                    stack: [],
                    category: 'Web',
                    icon: 'Code',
                    gradient: GRADIENT_OPTIONS[0].value,
                    image: '💻',
                    repositoryUrl: '',
                    demoUrl: ''
                  })
                }}
                className="gap-2"
              >
                <Plus weight="bold" className="h-4 w-4" />
                Novo Projeto
              </Button>
            </div>

            <AnimatePresence mode="popLayout">
              {(newProjectForm || editingProject) && (
                <ProjectForm
                  project={editingProject!}
                  onSave={handleSaveProject}
                  onCancel={() => {
                    setEditingProject(null)
                    setNewProjectForm(false)
                  }}
                />
              )}

              {!newProjectForm && !editingProject && (
                <>
                  {(projects || []).length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-12"
                    >
                      <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Code className="h-8 w-8 text-muted-foreground" weight="bold" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Nenhum projeto cadastrado</h3>
                      <p className="text-muted-foreground mb-4">Adicione seu primeiro projeto clicando no botão acima</p>
                    </motion.div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {(projects || []).map((project) => (
                        <motion.div
                          key={project.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                        >
                          <Card className="hover:border-primary/40 transition-colors">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <CardTitle className="text-lg">{project.title}</CardTitle>
                                    <Badge variant="secondary" className="text-xs">
                                      {project.category}
                                    </Badge>
                                  </div>
                                  <CardDescription>{project.description}</CardDescription>
                                </div>
                                <div className="ml-2 shrink-0">
                                  {project.image.startsWith('http') ? (
                                    <img 
                                      src={project.image} 
                                      alt={project.title}
                                      className="w-12 h-12 object-cover rounded-lg"
                                    />
                                  ) : (
                                    <span className="text-3xl">{project.image}</span>
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {project.stack.map((tech) => (
                                  <Badge key={tech} variant="outline" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingProject(project)}
                                  className="gap-2"
                                >
                                  <PencilSimple weight="bold" className="h-4 w-4" />
                                  Editar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteProject(project.id)}
                                  className="gap-2"
                                >
                                  <Trash weight="bold" className="h-4 w-4" />
                                  Remover
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Habilidades</h2>
              <Button
                onClick={() => {
                  setNewSkillForm(true)
                  setEditingSkill({ name: '', level: 50, icon: 'Code' })
                }}
                className="gap-2"
              >
                <Plus weight="bold" className="h-4 w-4" />
                Nova Habilidade
              </Button>
            </div>

            <AnimatePresence mode="popLayout">
              {(newSkillForm || editingSkill) && (
                <SkillForm
                  skill={editingSkill!}
                  onSave={handleSaveSkill}
                  onCancel={() => {
                    setEditingSkill(null)
                    setNewSkillForm(false)
                  }}
                />
              )}

              {!newSkillForm && !editingSkill && (
                <>
                  {(skills || []).length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-12"
                    >
                      <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Lightning className="h-8 w-8 text-muted-foreground" weight="bold" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Nenhuma habilidade cadastrada</h3>
                      <p className="text-muted-foreground mb-4">Adicione suas habilidades clicando no botão acima</p>
                    </motion.div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {(skills || []).map((skill) => {
                        const SkillIcon = ICON_OPTIONS.find((i) => i.value === skill.icon)?.icon || Code
                        return (
                          <motion.div
                            key={skill.name}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                          >
                            <Card className="hover:border-primary/40 transition-colors">
                              <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                      <SkillIcon className="h-5 w-5 text-primary" weight="bold" />
                                    </div>
                                    <CardTitle className="text-base">{skill.name}</CardTitle>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div>
                                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                    <span>Nível</span>
                                    <span>{skill.level}%</span>
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-2">
                                    <div
                                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                                      style={{ width: `${skill.level}%` }}
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingSkill(skill)}
                                    className="gap-2 flex-1"
                                  >
                                    <PencilSimple weight="bold" className="h-4 w-4" />
                                    Editar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteSkill(skill.name)}
                                    className="gap-2 flex-1"
                                  >
                                    <Trash weight="bold" className="h-4 w-4" />
                                    Remover
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <h2 className="text-2xl font-semibold">Configurações</h2>

            <Card>
              <CardHeader>
                <CardTitle>Apresentação</CardTitle>
                <CardDescription>Textos da página inicial</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-title">Nome</Label>
                  <Input
                    id="hero-title"
                    value={config.heroTitle}
                    onChange={(e) =>
                      setSiteConfig((prev) => ({ ...(prev || config), heroTitle: e.target.value }))
                    }
                    placeholder="Seu Nome"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero-subtitle">Função</Label>
                  <Input
                    id="hero-subtitle"
                    value={config.heroSubtitle}
                    onChange={(e) =>
                      setSiteConfig((prev) => ({ ...(prev || config), heroSubtitle: e.target.value }))
                    }
                    placeholder="Ex: Dev & Maker"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero-description">Descrição</Label>
                  <Textarea
                    id="hero-description"
                    value={config.heroDescription}
                    onChange={(e) =>
                      setSiteConfig((prev) => ({ ...(prev || config), heroDescription: e.target.value }))
                    }
                    placeholder="Conte um pouco sobre você"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contato</CardTitle>
                <CardDescription>Redes sociais e contato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={config.whatsappNumber}
                    onChange={(e) =>
                      setSiteConfig((prev) => ({ ...(prev || config), whatsappNumber: e.target.value }))
                    }
                    placeholder="5511999999999"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={config.email}
                    onChange={(e) =>
                      setSiteConfig((prev) => ({ ...(prev || config), email: e.target.value }))
                    }
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={config.github}
                    onChange={(e) =>
                      setSiteConfig((prev) => ({ ...(prev || config), github: e.target.value }))
                    }
                    placeholder="usuario"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={config.linkedin}
                    onChange={(e) =>
                      setSiteConfig((prev) => ({ ...(prev || config), linkedin: e.target.value }))
                    }
                    placeholder="perfil"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integração GitHub</CardTitle>
                <CardDescription>Configure seu username do GitHub para exibir repositórios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="github-username">Username do GitHub</Label>
                  <Input
                    id="github-username"
                    value={config.githubUsername || config.github}
                    onChange={(e) =>
                      setSiteConfig((prev) => ({ ...(prev || config), githubUsername: e.target.value }))
                    }
                    placeholder="seu-username"
                  />
                  <p className="text-xs text-muted-foreground">
                    Será usado para buscar seus repositórios públicos via API do GitHub
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seção "Sobre Mim"</CardTitle>
                <CardDescription>Configure o título e descrição da seção sobre você</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="about-title">Título da Seção</Label>
                  <Input
                    id="about-title"
                    value={config.aboutTitle || 'Sobre Mim'}
                    onChange={(e) =>
                      setSiteConfig((prev) => ({ ...(prev || config), aboutTitle: e.target.value }))
                    }
                    placeholder="Sobre Mim"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about-description">Descrição da Seção</Label>
                  <Textarea
                    id="about-description"
                    value={config.aboutDescription || ''}
                    onChange={(e) =>
                      setSiteConfig((prev) => ({ ...(prev || config), aboutDescription: e.target.value }))
                    }
                    placeholder="Escreva um texto sobre você e sua experiência..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seção "Call to Action"</CardTitle>
                <CardDescription>Configure a seção de chamada para ação/contato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cta-title">Título do CTA</Label>
                  <Input
                    id="cta-title"
                    value={config.ctaTitle || 'Vamos conversar?'}
                    onChange={(e) =>
                      setSiteConfig((prev) => ({ ...(prev || config), ctaTitle: e.target.value }))
                    }
                    placeholder="Vamos conversar?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cta-description">Descrição do CTA</Label>
                  <Textarea
                    id="cta-description"
                    value={config.ctaDescription || ''}
                    onChange={(e) =>
                      setSiteConfig((prev) => ({ ...(prev || config), ctaDescription: e.target.value }))
                    }
                    placeholder="Mensagem convidando para entrar em contato..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rodapé</CardTitle>
                <CardDescription>Personalize o texto do rodapé do site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="footer-text">Texto do Rodapé</Label>
                  <Input
                    id="footer-text"
                    value={config.footerText || ''}
                    onChange={(e) =>
                      setSiteConfig((prev) => ({ ...(prev || config), footerText: e.target.value }))
                    }
                    placeholder="Desenvolvido com React, TypeScript e Framer Motion"
                  />
                  <p className="text-xs text-muted-foreground">
                    Este texto aparecerá após o símbolo © e o ano
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSaveConfig} className="gap-2">
              <FloppyDisk weight="bold" className="h-4 w-4" />
              Salvar
            </Button>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <h2 className="text-2xl font-semibold">Segurança</h2>

            <Card>
              <CardHeader>
                <CardTitle>Proteção do Painel</CardTitle>
                <CardDescription>
                  {config.adminPassword 
                    ? 'O painel está protegido por senha' 
                    : 'Configure uma senha para proteger o acesso'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {config.adminPassword && (
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <LockKey className="h-5 w-5 text-primary" weight="fill" />
                        </div>
                        <div>
                          <p className="font-medium">Senha ativa</p>
                          <p className="text-sm text-muted-foreground">Seu painel está seguro</p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleRemovePassword}
                      >
                        Remover Senha
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="new-password">
                    {config.adminPassword ? 'Nova Senha' : 'Criar Senha'}
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Digite novamente"
                  />
                </div>

                <Button onClick={handleSetPassword} className="gap-2">
                  <LockKey weight="bold" className="h-4 w-4" />
                  {config.adminPassword ? 'Alterar Senha' : 'Definir Senha'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  )
}

function ProjectForm({
  project,
  onSave,
  onCancel
}: {
  project: Project
  onSave: (project: Project) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(project)
  const [stackInput, setStackInput] = useState('')

  const handleAddStack = () => {
    if (stackInput.trim()) {
      setFormData({
        ...formData,
        stack: [...formData.stack, stackInput.trim()]
      })
      setStackInput('')
    }
  }

  const handleRemoveStack = (index: number) => {
    setFormData({
      ...formData,
      stack: formData.stack.filter((_, i) => i !== index)
    })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="border-primary/40">
        <CardHeader>
          <CardTitle>{project.id === 0 ? 'Novo Projeto' : 'Editar Projeto'}</CardTitle>
          <CardDescription>Preencha os dados do projeto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nome do Projeto"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web">Web</SelectItem>
                  <SelectItem value="Programação">Programação</SelectItem>
                  <SelectItem value="Maker">Maker</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição Curta</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Breve descrição do projeto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullDescription">Descrição Completa</Label>
            <Textarea
              id="fullDescription"
              value={formData.fullDescription}
              onChange={(e) =>
                setFormData({ ...formData, fullDescription: e.target.value })
              }
              placeholder="Descrição detalhada que aparecerá no modal"
              rows={4}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="icon">Ícone</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData({ ...formData, icon: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gradient">Gradiente</Label>
              <Select
                value={formData.gradient}
                onValueChange={(value) => setFormData({ ...formData, gradient: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GRADIENT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Emoji/Imagem</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="🚀 ou URL da imagem"
              />
              <p className="text-xs text-muted-foreground">
                Use um emoji ou cole o URL de uma imagem
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stack">Tecnologias</Label>
            <div className="flex gap-2">
              <Input
                id="stack"
                value={stackInput}
                onChange={(e) => setStackInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddStack())}
                placeholder="Digite e pressione Enter"
              />
              <Button type="button" onClick={handleAddStack} size="icon">
                <Plus weight="bold" className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.stack.map((tech, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-destructive/20"
                  onClick={() => handleRemoveStack(index)}
                >
                  {tech}
                  <X className="h-3 w-3" weight="bold" />
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="repositoryUrl">URL do Repositório (GitHub)</Label>
              <Input
                id="repositoryUrl"
                value={formData.repositoryUrl || ''}
                onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
                placeholder="https://github.com/usuario/repo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demoUrl">URL do Demo/Site</Label>
              <Input
                id="demoUrl"
                value={formData.demoUrl || ''}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                placeholder="https://meusite.com"
              />
            </div>
          </div>

          <Separator />

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button onClick={() => onSave(formData)} className="gap-2">
              <FloppyDisk weight="bold" className="h-4 w-4" />
              Salvar
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function SkillForm({
  skill,
  onSave,
  onCancel
}: {
  skill: Skill
  onSave: (skill: Skill) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(skill)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="border-primary/40">
        <CardHeader>
          <CardTitle>
            {skill.name ? 'Editar Habilidade' : 'Nova Habilidade'}
          </CardTitle>
          <CardDescription>Preencha os dados da habilidade</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="skill-name">Nome</Label>
              <Input
                id="skill-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: React"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill-icon">Ícone</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData({ ...formData, icon: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skill-level">Nível ({formData.level}%)</Label>
            <input
              id="skill-level"
              type="range"
              min="0"
              max="100"
              value={formData.level}
              onChange={(e) =>
                setFormData({ ...formData, level: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                style={{ width: `${formData.level}%` }}
              />
            </div>
          </div>

          <Separator />

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button onClick={() => onSave(formData)} className="gap-2">
              <FloppyDisk weight="bold" className="h-4 w-4" />
              Salvar
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
