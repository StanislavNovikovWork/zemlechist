"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Главная" },
  { href: "/maps", label: "Карта" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[300px] bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
        >
          Землечист
        </Link>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
