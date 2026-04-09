import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/Badge'

describe('Badge', () => {
  it('텍스트를 렌더링한다', () => {
    render(<Badge>적용중</Badge>)
    expect(screen.getByText('적용중')).toBeInTheDocument()
  })

  it('variant 클래스를 적용한다', () => {
    const { container } = render(<Badge variant="active">적용중</Badge>)
    expect(container.firstChild).toHaveClass('active')
  })
})
