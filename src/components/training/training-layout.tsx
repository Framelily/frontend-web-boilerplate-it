'use client'

import { useState } from 'react'
import { Drawer, Menu } from 'antd'
import styled from 'styled-components'

import type { IDocGroup } from '@/lib/markdown'
import TrainingHeader from './training-header'
import MarkdownRenderer from './markdown-renderer'

interface TrainingLayoutProps {
  menu: IDocGroup[]
  docs: Record<string, string>
  defaultKey: string
}

export default function TrainingLayout({ menu, docs, defaultKey }: TrainingLayoutProps) {
  const [activeKey, setActiveKey] = useState(defaultKey)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const menuItems = menu.map((group) => ({
    key: group.label,
    label: <GroupLabel>{group.label}</GroupLabel>,
    type: 'group' as const,
    children: group.items.map((item) => ({
      key: item.key,
      label: item.label,
    })),
  }))

  const handleMenuClick = (key: string) => {
    setActiveKey(key)
    setDrawerOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const sidebarContent = (
    <Menu
      mode="inline"
      selectedKeys={[activeKey]}
      items={menuItems}
      onClick={({ key }) => handleMenuClick(key)}
      style={{ border: 'none' }}
    />
  )

  return (
    <PageWrapper>
      <TrainingHeader onMenuToggle={() => setDrawerOpen(true)} />
      <ContentWrapper>
        <Sidebar>{sidebarContent}</Sidebar>
        <Drawer
          title="Menu"
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          size="default"
          styles={{ body: { padding: 0 } }}
        >
          {sidebarContent}
        </Drawer>
        <MainContent>
          <MarkdownRenderer content={docs[activeKey] || '# Not found'} />
        </MainContent>
      </ContentWrapper>
    </PageWrapper>
  )
}

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #fff;
`

const ContentWrapper = styled.div`
  display: flex;
`

const Sidebar = styled.aside`
  width: 280px;
  min-width: 280px;
  border-right: 1px solid #e5e7eb;
  height: calc(100vh - 56px);
  position: sticky;
  top: 56px;
  overflow-y: auto;
  padding: 8px 0;

  @media (max-width: 768px) {
    display: none;
  }
`

const GroupLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #9ca3af;
`

const MainContent = styled.main`
  flex: 1;
  padding: 32px 48px;
  max-width: 100%;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`
