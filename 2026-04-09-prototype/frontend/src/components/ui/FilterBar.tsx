'use client'
import * as RadixSelect from '@radix-ui/react-select'
import styles from './FilterBar.module.css'

export interface FilterOption {
  key: string
  label: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}

interface FilterBarProps {
  filters: FilterOption[]
  searchPlaceholder?: string
  searchValue?: string
  onSearch?: (value: string) => void
  onReset?: () => void
}

export function FilterBar({
  filters,
  searchPlaceholder = '검색',
  searchValue = '',
  onSearch,
  onReset,
}: FilterBarProps) {
  return (
    <div className={styles.bar}>
      {filters.map((filter) => (
        <RadixSelect.Root key={filter.key} value={filter.value || '__all__'} onValueChange={(v) => filter.onChange(v === '__all__' ? '' : v)}>
          <RadixSelect.Trigger className={styles.select} aria-label={filter.label}>
            <RadixSelect.Value placeholder={filter.label} />
            <RadixSelect.Icon>
              <svg width="10" height="10" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M1 1l4 4 4-4"/>
              </svg>
            </RadixSelect.Icon>
          </RadixSelect.Trigger>
          <RadixSelect.Portal>
            <RadixSelect.Content className={styles.dropdown} position="popper" sideOffset={4}>
              <RadixSelect.Viewport>
                <RadixSelect.Item value="__all__" className={styles.item}>
                  <RadixSelect.ItemText>{filter.label} (전체)</RadixSelect.ItemText>
                </RadixSelect.Item>
                {filter.options.map((opt) => (
                  <RadixSelect.Item key={opt.value} value={opt.value} className={styles.item}>
                    <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                  </RadixSelect.Item>
                ))}
              </RadixSelect.Viewport>
            </RadixSelect.Content>
          </RadixSelect.Portal>
        </RadixSelect.Root>
      ))}

      {onSearch && (
        <div className={styles.searchWrap}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="7" cy="7" r="4.5"/>
            <path d="M10.5 10.5 13 13"/>
          </svg>
          <input
            type="search"
            className={styles.search}
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            aria-label={searchPlaceholder}
          />
        </div>
      )}

      {onReset && (
        <button className={styles.reset} onClick={onReset}>초기화</button>
      )}
    </div>
  )
}
