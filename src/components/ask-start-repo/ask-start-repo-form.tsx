'use client'

import { useRef, useState } from 'react'

import { App, Button, Checkbox, Divider, Input, Radio, Typography } from 'antd'
import styled from 'styled-components'

import { generateOutput } from '@/lib/ask-start-repo/generate-output'
import type { IGeneratedOutput, IProjectFormData, ProjectType } from '@/types/ask-start-repo'

const DEFAULT_FORM: IProjectFormData = {
  name: '',
  description: '',
  type: null,
  hasAuth: false,
  hasSeo: false,
  hasMultiLang: false,
  languages: '',
  hasRealtime: false,
  notes: '',
}

export default function AskStartRepoForm() {
  const { message } = App.useApp()
  const [form, setForm] = useState<IProjectFormData>(DEFAULT_FORM)
  const [output, setOutput] = useState<IGeneratedOutput | null>(null)
  const [errors, setErrors] = useState<{ name?: string; type?: string }>({})
  const outputRef = useRef<HTMLDivElement>(null)

  function validate(): boolean {
    const next: { name?: string; type?: string } = {}
    if (!form.name.trim()) next.name = 'กรุณากรอกชื่อโปรเจค'
    if (!form.type) next.type = 'กรุณาเลือกประเภทโปรเจค'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const result = generateOutput(form)
    setOutput(result)
    setTimeout(() => {
      outputRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  async function handleCopy(text: string, label: string) {
    await navigator.clipboard.writeText(text)
    message.success(`คัดลอก ${label} แล้ว`)
  }

  return (
    <PageContainer>
      <Typography.Title level={2}>เริ่มต้นโปรเจคใหม่</Typography.Title>
      <Typography.Text type='secondary'>
        ตอบคำถามด้านล่าง แล้วรับ repo recommendation และ AI prompt สำหรับ setup โปรเจค
      </Typography.Text>

      <FormCard>
        {/* Group 1 — Project Info */}
        <Divider orientationMargin='0'>ข้อมูลโปรเจค</Divider>

        <FieldGroup>
          <label>
            <FieldLabel>ชื่อโปรเจค *</FieldLabel>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder='เช่น Smart Retail Dashboard'
              status={errors.name ? 'error' : ''}
            />
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
          </label>
        </FieldGroup>

        <FieldGroup>
          <label>
            <FieldLabel>คำอธิบายโปรเจค *</FieldLabel>
            <Input.TextArea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder='อธิบายสั้นๆ ว่าโปรเจคนี้ทำอะไร'
              rows={3}
            />
          </label>
        </FieldGroup>

        {/* Group 2 — Project Type */}
        <Divider orientationMargin='0'>ประเภทโปรเจค *</Divider>

        <FieldGroup>
          <Radio.Group
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ProjectType }))}
          >
            <RadioOption value='web'>
              <span>🌐 Web</span>
              <RadioDesc>public-facing website</RadioDesc>
            </RadioOption>
            <RadioOption value='backoffice'>
              <span>🖥️ Backoffice</span>
              <RadioDesc>admin dashboard</RadioDesc>
            </RadioOption>
            <RadioOption value='electron'>
              <span>💻 Electron</span>
              <RadioDesc>desktop app</RadioDesc>
            </RadioOption>
          </Radio.Group>
          {errors.type && <ErrorText>{errors.type}</ErrorText>}
        </FieldGroup>

        {/* Group 3 — Core Features */}
        <Divider orientationMargin='0'>Features ที่ต้องการ</Divider>

        <FieldGroup>
          <CheckRow>
            <Checkbox
              checked={form.hasAuth}
              onChange={(e) => setForm((f) => ({ ...f, hasAuth: e.target.checked }))}
            >
              Authentication / Login
            </Checkbox>
          </CheckRow>
          <CheckRow>
            <Checkbox
              checked={form.hasSeo}
              onChange={(e) => setForm((f) => ({ ...f, hasSeo: e.target.checked }))}
            >
              SEO (meta tags, sitemap, Open Graph)
            </Checkbox>
          </CheckRow>
          <CheckRow>
            <Checkbox
              checked={form.hasMultiLang}
              onChange={(e) => setForm((f) => ({ ...f, hasMultiLang: e.target.checked }))}
            >
              Multi-language
            </Checkbox>
            {form.hasMultiLang && (
              <LangInput
                value={form.languages}
                onChange={(e) => setForm((f) => ({ ...f, languages: e.target.value }))}
                placeholder='เช่น th, en, zh'
                size='small'
              />
            )}
          </CheckRow>
          <CheckRow>
            <Checkbox
              checked={form.hasRealtime}
              onChange={(e) => setForm((f) => ({ ...f, hasRealtime: e.target.checked }))}
            >
              Real-time (WebSocket)
            </Checkbox>
          </CheckRow>
        </FieldGroup>

        {/* Group 4 — Notes */}
        <Divider orientationMargin='0'>อื่นๆ</Divider>

        <FieldGroup>
          <Input.TextArea
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder='อธิบาย requirements เพิ่มเติม เช่น ใช้ Oracle DB, ต้องรองรับ PWA, มี payment gateway'
            rows={4}
          />
        </FieldGroup>

        <Button type='primary' size='large' onClick={handleSubmit} className='mt-4'>
          Generate
        </Button>
      </FormCard>

      {/* Output Section */}
      {output && (
        <OutputSection ref={outputRef}>
          <Typography.Title level={3} className='mb-6'>
            ผลลัพธ์
          </Typography.Title>

          <OutputBlock>
            <BlockHeader>
              <Typography.Text strong>Repo + Clone Command</Typography.Text>
              <Button size='small' onClick={() => handleCopy(output.cloneBlock, 'clone command')}>
                Copy
              </Button>
            </BlockHeader>
            <pre>{output.cloneBlock}</pre>
          </OutputBlock>

          <OutputBlock>
            <BlockHeader>
              <Typography.Text strong>Setup Prompt</Typography.Text>
              <Typography.Text type='secondary' className='text-xs'>
                วางใน Claude ครั้งแรกหลัง clone
              </Typography.Text>
              <Button size='small' onClick={() => handleCopy(output.setupPrompt, 'setup prompt')}>
                Copy
              </Button>
            </BlockHeader>
            <pre>{output.setupPrompt}</pre>
          </OutputBlock>

          <OutputBlock>
            <BlockHeader>
              <Typography.Text strong>Project Brief</Typography.Text>
              <Typography.Text type='secondary' className='text-xs'>
                วางทุกครั้งที่เปิด session ใหม่
              </Typography.Text>
              <Button size='small' onClick={() => handleCopy(output.projectBrief, 'project brief')}>
                Copy
              </Button>
            </BlockHeader>
            <pre>{output.projectBrief}</pre>
          </OutputBlock>
        </OutputSection>
      )}
    </PageContainer>
  )
}

const PageContainer = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 40px 24px;
`

const FormCard = styled.div`
  background: var(--ant-color-bg-container, #fff);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 24px;
  margin-top: 24px;
`

const FieldGroup = styled.div`
  margin-bottom: 16px;
`

const FieldLabel = styled.div`
  font-weight: 500;
  margin-bottom: 6px;
`

const ErrorText = styled.div`
  color: var(--ant-color-error, #ff4d4f);
  font-size: 12px;
  margin-top: 4px;
`

const RadioOption = styled(Radio)`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`

const RadioDesc = styled.span`
  color: var(--color-text-secondary, #888);
  font-size: 12px;
  margin-left: 6px;
`

const CheckRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`

const LangInput = styled(Input)`
  width: 200px;
`

const OutputSection = styled.div`
  margin-top: 40px;
`

const OutputBlock = styled.div`
  background: var(--ant-color-bg-container, #fff);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;

  pre {
    background: #f5f5f5;
    border-radius: 4px;
    padding: 12px;
    margin-top: 12px;
    font-size: 13px;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-x: auto;
  }
`

const BlockHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`
