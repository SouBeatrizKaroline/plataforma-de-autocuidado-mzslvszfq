import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { QuickLogModal } from '@/components/QuickLogModal'
import {
  HeartPulse,
  Home,
  ClipboardList,
  FileText,
  Calendar as CalendarIcon,
  Pill,
  FileSpreadsheet,
  Stethoscope,
  Syringe,
  Bot,
  Settings,
  LogOut,
  Menu,
  Plus,
  User,
  ShieldAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const navItems = [
  { label: 'Início', path: '/dashboard', icon: Home },
  { label: 'Registros', path: '/registros', icon: ClipboardList },
  { label: 'Plano de Autocuidado', path: '/plano', icon: FileText },
  { label: 'Calendário', path: '/calendario', icon: CalendarIcon },
  { label: 'Medicamentos', path: '/medicamentos', icon: Pill },
  { label: 'Exames', path: '/exames', icon: FileSpreadsheet },
  { label: 'Consultas', path: '/consultas', icon: Stethoscope },
  { label: 'Vacinação', path: '/vacinacao', icon: Syringe },
  { label: 'Assistente IA', path: '/assistente', icon: Bot },
  { label: 'Configurações', path: '/configuracoes', icon: Settings },
]

export default function Layout() {
  const { user, signOut, isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [quickLogOpen, setQuickLogOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  if (
    !isAuthenticated &&
    location.pathname !== '/' &&
    location.pathname !== '/signup' &&
    !location.pathname.startsWith('/forgot-password') &&
    !location.pathname.startsWith('/reset-password') &&
    !location.pathname.startsWith('/verify-email') &&
    !location.pathname.startsWith('/confirm-email-change')
  ) {
    return <Outlet />
  }

  // Find page title for header
  const currentNav = navItems.find((item) => item.path === location.pathname)
  const pageTitle = currentNav ? currentNav.label : 'Plataforma de Autocuidado'

  const avatarUrl = user?.avatar
    ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/_pb_users_auth_/${user.id}/${user.avatar}`
    : `https://img.usecurling.com/ppl/medium?gender=female&seed=${user?.id || 1}`

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Quick Log Modal */}
      <QuickLogModal open={quickLogOpen} onOpenChange={setQuickLogOpen} />

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed inset-y-0 z-30">
          <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-teal-800 dark:text-teal-300 tracking-tight">
                Autocuidado
              </span>
              <span className="block text-[10px] text-teal-600 dark:text-teal-400 font-medium -mt-1">
                Saúde & Bem-Estar
              </span>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-teal-600 dark:text-teal-400' : ''}`}
                  />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={avatarUrl} alt={user?.name || 'Usuário'} />
                  <AvatarFallback className="bg-teal-100 text-teal-800 text-xs">
                    {user?.name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="truncate text-xs">
                  <p className="font-semibold truncate text-slate-800 dark:text-slate-200">
                    {user?.name || 'Usuário'}
                  </p>
                  <p className="text-slate-500 text-[11px] truncate">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                title="Sair"
                className="h-7 w-7 text-slate-400 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Wrapper */}
        <div className="flex-1 md:pl-64 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Drawer Trigger */}
              <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-5 h-5 text-slate-600" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0 flex flex-col">
                  <SheetHeader className="p-4 border-b border-slate-100 dark:border-slate-800">
                    <SheetTitle className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-bold">
                      <HeartPulse className="w-5 h-5 text-teal-600" />
                      Autocuidado
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      const isActive = location.pathname === item.path
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setDrawerOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-semibold'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      )
                    })}
                  </nav>
                </SheetContent>
              </Sheet>

              <h1 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
                {pageTitle}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setQuickLogOpen(true)}
                size="sm"
                className="bg-teal-600 hover:bg-teal-700 text-white gap-1.5 shadow-sm rounded-lg"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">+ Registrar hoje</span>
                <span className="sm:hidden">Registrar</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="w-8 h-8 border border-teal-200">
                      <AvatarImage src={avatarUrl} alt={user?.name || 'Usuário'} />
                      <AvatarFallback className="bg-teal-100 text-teal-800 text-xs">
                        {user?.name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {user?.name || 'Usuário'}
                    </p>
                    <p className="text-xs text-slate-500 font-normal truncate">{user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
                    <User className="w-4 h-4 mr-2" /> Meu Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
                    <Settings className="w-4 h-4 mr-2" /> Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-600 dark:text-red-400">
                    <LogOut className="w-4 h-4 mr-2" /> Sair da conta
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-20 md:pb-8 animate-fade-in">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
            <div className="flex items-center justify-center gap-1.5 max-w-xl mx-auto">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>
                Esta plataforma não substitui orientação médica profissional. Em caso de emergência,
                procure um serviço de saúde.
              </span>
            </div>
          </footer>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around h-14 px-2 shadow-lg">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center justify-center w-full h-full text-[11px] ${
            location.pathname === '/dashboard' ? 'text-teal-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Início</span>
        </Link>
        <Link
          to="/registros"
          className={`flex flex-col items-center justify-center w-full h-full text-[11px] ${
            location.pathname === '/registros' ? 'text-teal-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <span>Registros</span>
        </Link>
        <Link
          to="/calendario"
          className={`flex flex-col items-center justify-center w-full h-full text-[11px] ${
            location.pathname === '/calendario' ? 'text-teal-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <CalendarIcon className="w-5 h-5" />
          <span>Calendário</span>
        </Link>
        <Link
          to="/assistente"
          className={`flex flex-col items-center justify-center w-full h-full text-[11px] ${
            location.pathname === '/assistente' ? 'text-teal-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <Bot className="w-5 h-5" />
          <span>Assistente</span>
        </Link>
        <Link
          to="/configuracoes"
          className={`flex flex-col items-center justify-center w-full h-full text-[11px] ${
            location.pathname === '/configuracoes'
              ? 'text-teal-600 font-semibold'
              : 'text-slate-500'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Perfil</span>
        </Link>
      </nav>
    </div>
  )
}
