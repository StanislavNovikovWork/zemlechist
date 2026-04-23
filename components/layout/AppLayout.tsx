"use client";

import { useState } from "react";
import { Layout, Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Header, Sider, Content } = Layout;

const navItems = [
  { key: "/", label: "Главная", href: "/" },
  { key: "/maps", label: "Карта", href: "/maps" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = navItems.map((item) => ({
    key: item.key,
    label: <Link href={item.href}>{item.label}</Link>,
  }));

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
      >
        <div className="h-16 flex items-center justify-center bg-white/10 mb-4">
          <Link href="/" className="text-xl font-bold text-white hover:text-blue-300 transition-colors">
            {collapsed ? "З" : "Землечист"}
          </Link>
        </div>
        <Menu 
          theme="light" 
          mode="inline" 
          selectedKeys={[pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderBottom: '1px solid #e8e8e8' }} />
        <Content style={{ margin: 0 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
