'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import styled from 'styled-components'

import 'highlight.js/styles/github.css'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <MarkdownWrapper>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </MarkdownWrapper>
  )
}

const MarkdownWrapper = styled.div`
  max-width: 800px;
  line-height: 1.8;
  color: #1a1a1a;

  h1 {
    font-size: 28px;
    font-weight: 700;
    margin: 32px 0 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e5e7eb;
  }

  h2 {
    font-size: 22px;
    font-weight: 600;
    margin: 28px 0 12px;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 24px 0 8px;
  }

  h4 {
    font-size: 16px;
    font-weight: 600;
    margin: 20px 0 8px;
  }

  p {
    margin: 12px 0;
  }

  ul,
  ol {
    margin: 12px 0;
    padding-left: 24px;
  }

  li {
    margin: 4px 0;
  }

  code {
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 14px;
    font-family: 'SF Mono', 'Fira Code', monospace;
  }

  pre {
    background: #1e1e1e;
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 16px 0;

    code {
      background: none;
      padding: 0;
      color: #d4d4d4;
      font-size: 13px;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    font-size: 14px;
  }

  th {
    background: #f9fafb;
    font-weight: 600;
    text-align: left;
    padding: 10px 12px;
    border: 1px solid #e5e7eb;
  }

  td {
    padding: 10px 12px;
    border: 1px solid #e5e7eb;
  }

  blockquote {
    border-left: 4px solid #f7931e;
    padding: 8px 16px;
    margin: 16px 0;
    background: #fff7ed;
    border-radius: 0 8px 8px 0;
  }

  a {
    color: #f7931e;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  hr {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 32px 0;
  }

  img {
    max-width: 100%;
    border-radius: 8px;
  }
`
