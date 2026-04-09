'use client'

import styled from 'styled-components'
import {
  LuShieldCheck,
  LuServer,
  LuHeadset,
  LuUsers,
} from 'react-icons/lu'

function BrandingPanel() {
  return (
    <BrandingWrapper>
      <LogoRow>
        <LuShieldCheck size={32} color="#3699FF" />
        <LogoText>CyberRich Admin</LogoText>
      </LogoRow>

      <HeadlineBlock>
        <Headline>Welcome Back</Headline>
        <Subhead>Manage your business with powerful admin tools</Subhead>
      </HeadlineBlock>

      <ArtArea>
        <BgCircle1 />
        <BgCircle2 />
        <Rect1 />
        <Rect2 />
        <Rect3 />
        <SmallCircle1 />
        <SmallCircle2 />
        <SmallCircle3 />
        <Dot1 />
        <Dot2 />
        <Dot3 />
      </ArtArea>

      <StatsRow>
        <StatCard>
          <LuServer size={24} color="#3699FF" />
          <StatValue>99.9%</StatValue>
          <StatLabel>Uptime</StatLabel>
        </StatCard>
        <StatCard>
          <LuHeadset size={24} color="#50CD89" />
          <StatValue>24/7</StatValue>
          <StatLabel>Support</StatLabel>
        </StatCard>
        <StatCard>
          <LuUsers size={24} color="#FFC700" />
          <StatValue>10K+</StatValue>
          <StatLabel>Users</StatLabel>
        </StatCard>
      </StatsRow>
    </BrandingWrapper>
  )
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageWrapper>
      <BrandingPanel />
      <FormPanel>{children}</FormPanel>
    </PageWrapper>
  )
}

// ─── Layout ──────────────────────────────────────────────

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`

const FormPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  padding: 40px;
`

// ─── Branding Panel ──────────────────────────────────────

const BrandingWrapper = styled.div`
  width: 54%;
  min-height: 100vh;
  background: #1e1e2d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  gap: 40px;
  overflow: hidden;

  @media (max-width: 1024px) {
    display: none;
  }
`

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const LogoText = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
`

const HeadlineBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
`

const Headline = styled.h1`
  font-family: 'Inter', sans-serif;
  font-size: 42px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin: 0;
`

const Subhead = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #b5b5c3;
  text-align: center;
  line-height: 1.5;
  margin: 0;
`

// ─── Art Area ────────────────────────────────────────────

const ArtArea = styled.div`
  position: relative;
  width: 500px;
  height: 280px;
  flex-shrink: 0;
`

const BgCircle1 = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, #3699ff44, #3699ff00);
  left: 20px;
  top: 40px;
`

const BgCircle2 = styled.div`
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, #3699ff33, #3699ff00);
  left: 300px;
  top: 10px;
`

const Rect1 = styled.div`
  position: absolute;
  width: 140px;
  height: 100px;
  border-radius: 20px;
  background: linear-gradient(to bottom, #3699ff, #1b6fd1);
  opacity: 0.9;
  transform: rotate(8deg);
  left: 80px;
  top: 60px;
`

const Rect2 = styled.div`
  position: absolute;
  width: 120px;
  height: 85px;
  border-radius: 16px;
  background: linear-gradient(to bottom, #50cd89, #3699ff);
  opacity: 0.7;
  transform: rotate(-6deg);
  left: 260px;
  top: 80px;
`

const Rect3 = styled.div`
  position: absolute;
  width: 160px;
  height: 90px;
  border-radius: 18px;
  background: linear-gradient(to bottom, #3699ff88, #1e1e2d00);
  opacity: 0.5;
  transform: rotate(3deg);
  left: 180px;
  top: 140px;
`

const SmallCircle1 = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #3699ff33;
  left: 60px;
  top: 170px;
`

const SmallCircle2 = styled.div`
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, #3699ff55, #3699ff11);
  left: 350px;
  top: 180px;
`

const SmallCircle3 = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #50cd8944;
  left: 240px;
  top: 20px;
`

const Dot1 = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #3699ff66;
  left: 160px;
  top: 30px;
`

const Dot2 = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ffffff33;
  left: 400px;
  top: 100px;
`

const Dot3 = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #50cd8966;
  left: 45px;
  top: 120px;
`

// ─── Stats ───────────────────────────────────────────────

const StatsRow = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  justify-content: center;
`

const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 20px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  flex: 1;
`

const StatValue = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
`

const StatLabel = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #b5b5c3;
`
