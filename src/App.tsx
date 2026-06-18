import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { Boxes, ChartNoAxesCombined, LayoutDashboard, Package, ReceiptText, Tags, Users } from 'lucide-react'

import { PrivateRoute } from './components/auth/PrivateRoute'
import { RoleGuard } from './components/auth/RoleGuard'
import { useAuth } from './hooks/useAuth'
import { useOrganization } from './hooks/useOrganization'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProductsPage } from './pages/ProductsPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { ReportsPage } from './pages/ReportsPage'
import { SalesPage } from './pages/SalesPage'
import { StockPage } from './pages/StockPage'
import { UsersPage } from './pages/UsersPage'
import { SuperAdminOrganizationsPage } from './pages/SuperAdminOrganizationsPage'
import { SuperAdminUsersManagementPage } from './pages/SuperAdminUsersManagementPage'
import { SuperAdminDashboardPage } from './pages/super-admin/SuperAdminDashboardPage'
import { OrganizationSelectPage } from './pages/OrganizationSelectPage'
import { OrganizationSelectedGuard } from './components/auth/OrganizationSelectedGuard'

const navigation = [
  { to: '/', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/products', label: 'Produits', icon: Package },
  { to: '/categories', label: 'Catégories', icon: Tags },
  { to: '/sales', label: 'Ventes', icon: ReceiptText },
  { to: '/stock', label: 'Stock', icon: Boxes },
  { to: '/reports', label: 'Rapports', icon: ChartNoAxesCombined },
  // Gestion membres (Super Admin)
  { to: '/super-admin-dashboard', label: 'Dashboard SA', icon: LayoutDashboard },
  { to: '/super-admin', label: 'Organisations', icon: Users },
  { to: '/super-admin/users', label: 'Vendeurs / Membres', icon: Users },
]

function AppLayout() {
  const { user, logout } = useAuth()
  const { organization } = useOrganization()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white px-4 py-5 md:block">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-600 text-white">
            <Users size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold">Gestion commerciale</p>
            <p className="text-xl text-emerald-600 font-medium">
              {organization?.name ?? 'Organisation'}
            </p>
          </div>
        </div>

        <nav className="space-y-1">
          {navigation
            .filter((item) => {
              const role = user?.role
              if (role === 'admin') {
                return ['/', '/products', '/categories', '/sales', '/stock', '/reports', '/users', '/super-admin/users'].includes(item.to)
              }
              if (role === 'vendeur') {
                return ['/', '/sales', '/stock'].includes(item.to)
              }
              if (role === 'super_admin') {
                return ['/super-admin-dashboard', '/super-admin', '/super-admin/users'].includes(item.to)
              }
              return false
            })
            .map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                      isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              )
            })}
        </nav>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">{user?.name ?? 'Utilisateur'}</p>
              <p className="text-xs text-slate-500">{user?.role ?? 'Role'}</p>
            </div>
            <button
              className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              type="button"
              onClick={logout}
            >
              Deconnexion
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6">
          <Routes>
            <Route index element={<DashboardPage />} />
            <Route
              path="products"
              element={
                <RoleGuard allowedRoles={['admin']}>
                  <ProductsPage />
                </RoleGuard>
              }
            />
            <Route
              path="categories"
              element={
                <RoleGuard allowedRoles={['admin']}>
                  <CategoriesPage />
                </RoleGuard>
              }
            />
            <Route path="sales" element={<SalesPage />} />
            <Route path="stock" element={<StockPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route
              path="super-admin"
              element={
                <RoleGuard allowedRoles={['super_admin']}>
                  <SuperAdminOrganizationsPage />
                </RoleGuard>
              }
            />
            <Route
              path="super-admin/users"
              element={
                <RoleGuard allowedRoles={['super_admin']}>
                  <SuperAdminUsersManagementPage />
                </RoleGuard>
              }
            />
            <Route
              path="super-admin-dashboard"
              element={
                <RoleGuard allowedRoles={['super_admin']}>
                  <SuperAdminDashboardPage />
                </RoleGuard>
              }
            />
            <Route
              path="reports"
              element={
                <RoleGuard allowedRoles={['admin']}>
                  <ReportsPage />
                </RoleGuard>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/organization-select" element={<OrganizationSelectPage />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <OrganizationSelectedGuard>
              <AppLayout />
            </OrganizationSelectedGuard>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App