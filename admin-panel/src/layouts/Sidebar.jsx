import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiPlus,
  FiTag,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";

const ROLE = "admin"; // 👉 UI demo purpose (change manually if needed)

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      {
        to: "/dashboard",
        label: "Dashboard",
        roles: ["admin", "editor"],
        icon: FiHome,
      },
    ],
  },
  {
    label: "Catalogue",
    items: [
      {
        to: "/products",
        label: "Products",
        roles: ["admin", "editor"],
        icon: FiBox,
      },
      {
        to: "/products/create",
        label: "Add Product",
        roles: ["admin", "editor"],
        icon: FiPlus,
      },
      {
        to: "/categories",
        label: "Categories",
        roles: ["admin"],
        icon: FiTag,
      },
    ],
  },
  {
    label: "Sales",
    items: [
      {
        to: "/orders",
        label: "Orders",
        roles: ["admin"],
        icon: FiShoppingCart,
      },
      {
        to: "/cart",
        label: "Cart",
        roles: ["admin", "editor"],
        icon: FiShoppingCart,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        to: "/profile",
        label: "Profile",
        roles: ["admin", "editor"],
        icon: FiUser,
      },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64 flex flex-col
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
        `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Admin Panel
            </p>
            <p className="text-[11px] text-gray-400 capitalize">{ROLE}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
          {NAV_SECTIONS.map((section) => {
            const visible = section.items.filter((item) =>
              item.roles.includes(ROLE),
            );

            if (!visible.length) return null;

            return (
              <div key={section.label}>
                <p className="px-3 mb-2 text-[10px] uppercase tracking-widest text-gray-400">
                  {section.label}
                </p>

                <ul className="space-y-1">
                  {visible.map((item) => {
                    const Icon = item.icon;

                    return (
                      <li key={item.to}>
                        <NavLink
                          to={item.to}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                            ${
                              isActive
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`
                          }>
                          {({ isActive }) => (
                            <>
                              <Icon
                                className={`w-4 h-4 ${
                                  isActive
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-gray-400"
                                }`}
                              />
                              {item.label}
                            </>
                          )}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* Bottom demo user */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
              U
            </div>
            <div>
              <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                Demo User
              </p>
              <p className="text-[11px] text-gray-400 capitalize">{ROLE}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
