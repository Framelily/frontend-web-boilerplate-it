'use client'

import { useState } from 'react'
import { Button, Checkbox, Form, Input, App } from 'antd'
import styled from 'styled-components'
import { LuLogIn } from 'react-icons/lu'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from '@/i18n/routing'

interface ILoginForm {
  email: string
  password: string
  remember: boolean
}

const passwordRules = [
  { required: true, message: 'Please enter your password' },
  { min: 4, message: 'Password must be at least 4 characters' },
  {
    pattern: /(?=.*[a-z])(?=.*[A-Z])/,
    message: 'Password must contain both uppercase and lowercase letters',
  },
]

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: ILoginForm) => {
    setLoading(true)
    try {
      await login(values.email, values.password)
      router.push('/')
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormContainer>
      <FormHeader>
        <Title>Sign In</Title>
        <Subtitle>Enter your credentials to access admin panel</Subtitle>
      </FormHeader>

      <Form layout="vertical" onFinish={onFinish} autoComplete="off" requiredMark={false}>
        <Form.Item
          name="email"
          label={<FieldLabel>Email Address</FieldLabel>}
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input size="large" placeholder="admin@cyberrich.com" prefix={<MailIcon />} />
        </Form.Item>

        <Form.Item
          name="password"
          label={<FieldLabel>Password</FieldLabel>}
          rules={passwordRules}
        >
          <Input.Password size="large" placeholder="••••••••" prefix={<LockIcon />} />
        </Form.Item>

        <OptionsRow>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>
              <RememberText>Remember me</RememberText>
            </Checkbox>
          </Form.Item>
          <ForgotLink href="#">Forgot Password?</ForgotLink>
        </OptionsRow>

        <ActionsBlock>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            icon={<LuLogIn size={18} />}
            style={{
              height: 48,
              borderRadius: 8,
              background: '#3699FF',
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            Sign In
          </Button>

          <Divider>
            <DividerLine />
            <DividerText>OR</DividerText>
            <DividerLine />
          </Divider>

          <GoogleButton type="button">
            <GoogleG>G</GoogleG>
            <span>Sign in with Google</span>
          </GoogleButton>
        </ActionsBlock>
      </Form>

      <Footer>
        <FooterText>Don&apos;t have an account?</FooterText>
        <ContactLink href="#">Contact Admin</ContactLink>
      </Footer>
    </FormContainer>
  )
}

// ─── Mini icon components ────────────────────────────────

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B5B5C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B5B5C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

// ─── Styled Components ───────────────────────────────────

const FormContainer = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`

const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Title = styled.h2`
  font-family: 'Inter', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #181c32;
  margin: 0;
`

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #a1a5b7;
  margin: 0;
`

const FieldLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #181c32;
`

const OptionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`

const RememberText = styled.span`
  font-size: 13px;
  color: #a1a5b7;
`

const ForgotLink = styled.a`
  font-size: 13px;
  font-weight: 500;
  color: #3699ff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const ActionsBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: #e4e6ef;
`

const DividerText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #b5b5c3;
`

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 48px;
  border-radius: 8px;
  border: 1px solid #e4e6ef;
  background: #ffffff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #181c32;
  transition: background 0.2s;

  &:hover {
    background: #f9f9f9;
  }
`

const GoogleG = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #4285f4;
`

const Footer = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
`

const FooterText = styled.span`
  font-size: 13px;
  color: #a1a5b7;
`

const ContactLink = styled.a`
  font-size: 13px;
  font-weight: 600;
  color: #3699ff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
