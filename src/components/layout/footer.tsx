import styled from 'styled-components'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <FooterWrapper>
      <p>&copy; {year} Project Name. All rights reserved.</p>
    </FooterWrapper>
  )
}

const FooterWrapper = styled.footer`
  background: #fff;
  padding: 24px 0;
  text-align: center;
  border-top: 1px solid var(--color-border);
  color: var(--color-secondary);
  font-size: 14px;
`
