import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { 
  WhatsappLogo, 
  Sun, 
  Moon, 
  Code, 
  Wrench, 
  Cpu,
  ArrowRight,
  Envelope,
  GithubLogo,
  LinkedinLogo,
  Sparkle,
  Lightning,
  Rocket,
  Star,
  BracketsCurly,
  DeviceMobile,
  Database,
  Gear,
  UserGear
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AdminPanel } from '@/components/AdminPanel'
import { ProjectsSection } from '@/components/ProjectsSection'
import { ScrollToTop } from '@/components/ScrollToTop'



function App() {
  const [theme, setTheme] = useKV<'dark' | 'light'>('theme', 'dark')
  const [adminProjects] = useKV<any[]>('admin-projects', [])
  const [adminSkills] = useKV<any[]>('admin-skills', [])
  const [adminConfig] = useKV<any>('admin-site-config', {})
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const { scrollYProgress } = useScroll()
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])

  const projects = adminProjects || []
  const skills = adminSkills || []
  const config = adminConfig && Object.keys(adminConfig).length > 0 ? adminConfig : {
    heroTitle: 'Seu Nome',
    heroSubtitle: 'Desenvolvedor',
    heroDescription: 'Desenvolva sua apresentação aqui. Acesse o painel admin para personalizar.',
    whatsappNumber: '',
    email: 'seu@email.com',
    github: 'seu-usuario',
    linkedin: 'seu-perfil',
    githubUsername: '',
    aboutTitle: 'Sobre Mim',
    aboutDescription: 'Desenvolvedor apaixonado por tecnologia e inovação. Trabalho com desenvolvimento web moderno, programação Python para automação e projetos maker com Arduino. Estou sempre aprendendo e buscando novos desafios para expandir minhas habilidades.',
    ctaTitle: 'Vamos conversar?',
    ctaDescription: 'Estou disponível para conversar sobre projetos, tirar dúvidas ou falar sobre tecnologia',
    footerText: 'Desenvolvido com React, TypeScript e Framer Motion'
  }

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Code, Database, Lightning, DeviceMobile, Gear, Cpu, BracketsCurly, Rocket
    }
    return icons[iconName] || Code
  }

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  const toggleTheme = () => {
    setTheme((current) => current === 'dark' ? 'light' : 'dark')
  }

  const whatsappLink = config.whatsappNumber 
    ? `https://wa.me/${config.whatsappNumber}?text=Oi!%20Vi%20seu%20portfólio%20e%20queria%20conversar.`
    : '#'

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 80,
        damping: 15
      }
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ScrollToTop />
      
      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
      
      <motion.div 
        className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 40, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/8 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -40, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/6 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 120, 240, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      <motion.header 
        className="sticky top-0 z-50 w-full border-b border-border/40 glassmorphism"
        style={{ opacity: headerOpacity }}
      >
        <div className="container flex h-16 items-center justify-between max-w-6xl mx-auto px-4">
          <motion.div 
            className="font-bold text-lg bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {config.heroTitle.split(' ')[0] || 'Portfolio'}
          </motion.div>
          <div className="flex items-center gap-2">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAdminPanel(true)}
                className="rounded-full h-10 w-10"
              >
                <UserGear className="h-5 w-5" weight="bold" />
              </Button>
            </motion.div>
            <motion.div 
              whileHover={{ rotate: 180 }} 
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full h-10 w-10"
              >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -45, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 45, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <Sun className="h-5 w-5" weight="bold" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 45, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -45, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <Moon className="h-5 w-5" weight="bold" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
          </div>
        </div>
      </motion.header>

      <main>
        <motion.section 
          className="py-16 px-4 relative"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="container max-w-4xl mx-auto text-center">
            <motion.div variants={itemVariants} className="inline-block mb-4">
              <Badge 
                variant="outline" 
                className="border-primary/50 text-primary font-medium px-4 py-1.5 text-sm"
              >
                <Sparkle className="h-3.5 w-3.5 mr-1.5 inline" weight="fill" />
                {config.heroSubtitle}
              </Badge>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight"
            >
              {config.heroTitle || 'Seu Portfólio'}
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              {config.heroDescription || 'Configure suas informações no painel admin para personalizar seu portfólio.'}
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-3 justify-center"
            >
              <motion.div 
                whileHover={{ scale: 1.03, y: -2 }} 
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button 
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                  asChild
                >
                  <a href="#projetos">
                    <Rocket weight="fill" className="h-5 w-5" />
                    Ver Projetos
                    <ArrowRight weight="bold" className="h-5 w-5" />
                  </a>
                </Button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03, y: -2 }} 
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button 
                  size="lg"
                  variant="outline"
                  className="gap-2 border-primary/50 hover:bg-primary/10"
                  asChild
                >
                  <a href="#sobre">
                    <Star weight="fill" className="h-5 w-5" />
                    Sobre Mim
                  </a>
                </Button>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.03, y: -2 }} 
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button 
                  size="lg"
                  variant="outline"
                  asChild
                  className="gap-2 border-accent/50 hover:bg-accent/10"
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <WhatsappLogo weight="fill" className="h-5 w-5" />
                    Contato
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        <ProjectsSection 
          projects={projects} 
          githubUsername={config.githubUsername || config.github || ''} 
        />

        <section id="sobre" className="py-16 px-4 bg-muted/20">
          <div className="container max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                {config.aboutTitle || 'Sobre Mim'}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {config.aboutDescription || 'Desenvolvedor apaixonado por tecnologia e inovação. Trabalho com desenvolvimento web moderno, programação Python para automação e projetos maker com Arduino. Estou sempre aprendendo e buscando novos desafios para expandir minhas habilidades.'}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {[
                { 
                  icon: Code, 
                  title: "Desenvolvimento Web", 
                  desc: "Criação de sites responsivos e aplicações web modernas com React, TypeScript e design profissional.",
                  color: "primary" 
                },
                { 
                  icon: Database, 
                  title: "Python & Automação", 
                  desc: "Scripts de automação, processamento de dados e desenvolvimento de sistemas backend eficientes.",
                  color: "secondary" 
                },
                { 
                  icon: Cpu, 
                  title: "Projetos Maker", 
                  desc: "Internet das Coisas, eletrônica básica e projetos com Arduino para soluções práticas e criativas.",
                  color: "accent" 
                },
                { 
                  icon: Wrench, 
                  title: "Suporte Técnico", 
                  desc: "Manutenção de computadores, diagnóstico de problemas e soluções tecnológicas personalizadas.",
                  color: "primary" 
                }
              ].map((area, index) => (
                <motion.div
                  key={area.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 80, damping: 15 }}
                  whileHover={{ 
                    y: -4,
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                >
                  <Card className="border-border/50 hover:border-primary/50 transition-all h-full group hover:shadow-lg hover:shadow-primary/10 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-500"
                    />
                    <CardHeader className="relative z-10">
                      <div className="flex items-start gap-4">
                        <motion.div 
                          className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0"
                          whileHover={{ 
                            rotate: [0, -5, 5, -5, 0],
                            scale: 1.05
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          <area.icon className="h-6 w-6 text-primary" weight="bold" />
                        </motion.div>
                        <div>
                          <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">{area.title}</CardTitle>
                          <CardDescription className="text-sm leading-relaxed">
                            {area.desc}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
            >
              {skills.length > 0 && (
                <>
                  <h3 className="text-2xl font-bold text-center mb-8">Minhas Habilidades</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                    {skills.map((skill: any, index: number) => {
                      const SkillIcon = getIconComponent(skill.icon)
                      return (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.08, type: "spring", stiffness: 80, damping: 15 }}
                          whileHover={{ 
                            scale: 1.05,
                            y: -4,
                            transition: { type: "spring", stiffness: 400, damping: 17 }
                          }}
                        >
                          <div className="glassmorphism rounded-xl p-4 text-center group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                            <motion.div
                              whileHover={{ 
                                rotate: [0, -8, 8, -8, 0],
                                scale: 1.15
                              }}
                              transition={{ duration: 0.5 }}
                            >
                              <SkillIcon className="h-6 w-6 mx-auto mb-3 text-primary" weight="bold" />
                            </motion.div>
                            <div className="text-sm font-semibold mb-2 text-foreground/90">{skill.name}</div>
                            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                              <motion.div 
                                className="h-full bg-gradient-to-r from-primary via-accent to-secondary rounded-full relative overflow-hidden"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.level}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, delay: index * 0.1, ease: "easeOut" }}
                              >
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                  animate={{
                                    x: ['-100%', '100%']
                                  }}
                                  transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: "linear"
                                  }}
                                />
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </section>

        <motion.section 
          className="py-16 px-4 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="container max-w-3xl mx-auto text-center">
            <motion.div 
              className="glassmorphism rounded-3xl p-10 border-2 border-primary/20 relative overflow-hidden"
              initial={{ scale: 0.96, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <motion.div
                className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.3, 0.5, 0.3],
                  x: [0, 15, 0],
                  y: [0, 15, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <motion.div
                className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.3, 0.5, 0.3],
                  x: [0, -15, 0],
                  y: [0, -15, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, delay: 1.5, ease: "easeInOut" }}
              />
              
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 4, 0, -4, 0]
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkle className="h-12 w-12 mx-auto mb-4 text-primary" weight="fill" />
              </motion.div>
              <motion.h2 
                className="text-3xl sm:text-4xl font-bold mb-4"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 80, damping: 15 }}
              >
                {config.ctaTitle || 'Vamos conversar?'}
              </motion.h2>
              <motion.p 
                className="text-muted-foreground mb-8 max-w-md mx-auto text-lg"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08, type: "spring", stiffness: 80, damping: 15 }}
              >
                {config.ctaDescription || 'Estou disponível para conversar sobre projetos, tirar dúvidas ou falar sobre tecnologia'}
              </motion.p>
              
              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  { icon: WhatsappLogo, label: "WhatsApp", href: whatsappLink, variant: "default" as const, show: !!config.whatsappNumber },
                  { icon: Envelope, label: "Email", href: `mailto:${config.email}`, variant: "outline" as const, show: !!config.email },
                  { icon: GithubLogo, label: "GitHub", href: `https://github.com/${config.github}`, variant: "outline" as const, show: !!config.github },
                  { icon: LinkedinLogo, label: "LinkedIn", href: `https://linkedin.com/in/${config.linkedin}`, variant: "outline" as const, show: !!config.linkedin }
                ].filter(contact => contact.show).map((contact, idx) => (
                  <motion.div
                    key={contact.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08, type: "spring", stiffness: 80, damping: 15 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button 
                      size="lg"
                      variant={contact.variant}
                      asChild
                      className={contact.variant === "default" 
                        ? "gap-2 bg-gradient-to-r from-accent to-primary hover:opacity-90 text-white shadow-lg shadow-primary/30"
                        : "gap-2 hover:border-primary/50"}
                    >
                      <a href={contact.href} target="_blank" rel="noopener noreferrer">
                        <contact.icon weight="fill" className="h-5 w-5" />
                        {contact.label}
                      </a>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <footer className="border-t border-border/40 py-8 px-4 bg-muted/20">
        <div className="container max-w-5xl mx-auto text-center">
          <motion.p 
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            © {new Date().getFullYear()} {config.heroTitle || 'Portfolio'} • {config.footerText || 'Desenvolvido com React, TypeScript e Framer Motion'}
          </motion.p>
        </div>
      </footer>
    </div>
  )
}

export default App
