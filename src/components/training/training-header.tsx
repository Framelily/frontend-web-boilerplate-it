'use client'

import { MenuOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import styled from 'styled-components'

interface TrainingHeaderProps {
  onMenuToggle?: () => void
}

export default function TrainingHeader({ onMenuToggle }: TrainingHeaderProps) {
  return (
    <Header>
      <LeftSection>
        {onMenuToggle && (
          <MenuButton className="mobile-menu">
            <Button type="text" icon={<MenuOutlined />} onClick={onMenuToggle} />
          </MenuButton>
        )}
        <Title>Claude Code Training</Title>
      </LeftSection>
      <Brand>CyberRich Digital</Brand>
    </Header>
  )
}

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const MenuButton = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #1a1a1a;
`

const Brand = styled.span`
  font-size: 14px;
  color: #9ca3af;
  font-weight: 500;
`
