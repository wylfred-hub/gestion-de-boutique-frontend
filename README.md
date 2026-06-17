frontend/
├── src/
│   ├── types/                    ← Types générés de DOCUMENTATION
│   │   ├── index.ts              ← Export all
│   │   ├── User.ts
│   │   ├── Organization.ts
│   │   ├── Product.ts
│   │   ├── Category.ts
│   │   ├── Client.ts
│   │   ├── Sale.ts
│   │   ├── SaleItem.ts
│   │   └── StockMovement.ts
│   │
│   ├── api/                      ← Services API
│   │   ├── client.ts             ← Axios config + interceptors
│   │   ├── auth.ts               ← Login/logout
│   │   ├── products.ts           ← GET/POST products
│   │   ├── sales.ts              ← GET/POST sales
│   │   ├── stock.ts              ← Mouvements stock
│   │   ├── clients.ts            ← Clients CRUD
│   │   ├── categories.ts         ← Categories CRUD
│   │   └── reports.ts            ← Rapports
│   │
│   ├── store/                    ← State Management (Zustand/Redux)
│   │   ├── authStore.ts          ← User + token + org
│   │   ├── productStore.ts       ← Produits cache
│   │   ├── saleStore.ts          ← Ventes cache
│   │   └── organizationStore.ts  ← Org active
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Loading.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── ApiError.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── PrivateRoute.tsx   ← Auth guard
│   │   │   └── RoleGuard.tsx      ← Role guard
│   │   │
│   │   ├── products/
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   └── ProductCard.tsx
│   │   │
│   │   ├── sales/
│   │   │   ├── SaleList.tsx
│   │   │   ├── SaleForm.tsx
│   │   │   ├── SaleDetail.tsx
│   │   │   ├── SaleStatusBadge.tsx
│   │   │   ├── SaleStateActions.tsx  ← Boutons état machine
│   │   │   └── SaleItemTable.tsx
│   │   │
│   │   ├── stock/
│   │   │   ├── StockMovementForm.tsx
│   │   │   ├── StockHistoryTable.tsx
│   │   │   └── StockAlertBadge.tsx
│   │   │
│   │   └── reports/
│   │       ├── StockReport.tsx
│   │       ├── SalesReport.tsx
│   │       └── ReportExport.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts            ← Auth context
│   │   ├── useOrganization.ts    ← Org courante
│   │   ├── usePermissions.ts     ← Vérif rôles
│   │   ├── useSaleStateMachine.ts← État machine ventes
│   │   └── useApi.ts             ← Fetch wrapper
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── SalesPage.tsx
│   │   ├── StockPage.tsx
│   │   ├── ReportsPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── utils/
│   │   ├── constants.ts           ← Endpoints, rôles, etc.
│   │   ├── validators.ts          ← Validations
│   │   └── formatters.ts          ← Format monnaie, dates
│   │
│   ├── App.tsx                    ← Router + layout
│   └── main.tsx
│
└── package.json