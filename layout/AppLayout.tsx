"use client";

import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined, HomeOutlined, EnvironmentOutlined, ShopOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Header, Sider, Content } = Layout;

const navItems = [
  { key: "/", label: "Главная", href: "/", icon: <HomeOutlined /> },
  { key: "/maps", label: "Карта", href: "/maps", icon: <EnvironmentOutlined /> },
  { key: "/suppliers", label: "Поставщики", href: "/suppliers", icon: <ShopOutlined /> },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = navItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: <Link href={item.href}>{item.label}</Link>,
  }));

  return (
    <Layout style={{ minHeight: "100vh", height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={true} theme="dark">
        <div className="h-16 flex items-center justify-center bg-white/10 mb-4">
          <Link href="/" className="text-xl font-bold text-white hover:text-blue-300 transition-colors">
           {"З"}
          </Link>
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[pathname]} items={menuItems} />
      </Sider>
      <Layout style={{ height: "100vh" }}>
        <Content
          style={{
            padding: 0,
            height: "100%",
            background: colorBgContainer,
            borderRadius: `${borderRadiusLG}px ${borderRadiusLG}px 0 0`,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
