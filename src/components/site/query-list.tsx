'use client'
import { Suspense, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import { FilterLinks, Pagination } from './list-nav'

// Lets a statically cached page filter and paginate by its address (?topic=…&page=2)
// in the visitor's browser. The server renders every item once; the cached HTML shows
// the unfiltered first page, and these components apply the address when the page loads.

export type QueryItem = { key: string; value?: string; node: ReactNode }

const pageFrom = (raw: string | null) => {
  const n = Number(raw)
  return Number.isInteger(n) && n > 0 ? Math.min(n, 10000) : 1
}

const hrefFor = (basePath: string, param: string, value: string, page = 1) => {
  const q = new URLSearchParams()
  if (value) q.set(param, value)
  if (page > 1) q.set('page', String(page))
  return `${basePath}${q.size ? `?${q}` : ''}`
}

type FilterProps = {
  basePath: string
  param: string
  label: string
  options: { label: string; value: string }[]
}

function FilterView({ selected, ...props }: FilterProps & { selected: string }) {
  return (
    <FilterLinks
      label={props.label}
      options={props.options}
      selected={selected}
      href={(value) => hrefFor(props.basePath, props.param, value)}
    />
  )
}

function FilterFromAddress(props: FilterProps) {
  const selected = useSearchParams().get(props.param) || ''
  return <FilterView {...props} selected={selected} />
}

export function QueryFilterLinks(props: FilterProps) {
  return (
    <Suspense fallback={<FilterView {...props} selected="" />}>
      <FilterFromAddress {...props} />
    </Suspense>
  )
}

type ListProps = {
  basePath: string
  param: string
  items: QueryItem[]
  empty: ReactNode
  className?: string
  pageSize?: number
}

function ListView({
  selected,
  page,
  basePath,
  param,
  items,
  empty,
  className,
  pageSize,
}: ListProps & { selected: string; page: number }) {
  const matching = items.filter((item) => !selected || item.value === selected)
  const total = pageSize ? Math.ceil(matching.length / pageSize) : 1
  const shown = pageSize ? matching.slice((page - 1) * pageSize, page * pageSize) : matching
  return (
    <>
      {shown.length ? (
        <div className={className}>
          {shown.map((item) => (
            <div key={item.key} className="contents">
              {item.node}
            </div>
          ))}
        </div>
      ) : (
        empty
      )}
      <Pagination
        current={page}
        total={total}
        href={(p) => hrefFor(basePath, param, selected, p)}
      />
    </>
  )
}

function ListFromAddress(props: ListProps) {
  const params = useSearchParams()
  return (
    <ListView
      {...props}
      selected={params.get(props.param) || ''}
      page={pageFrom(params.get('page'))}
    />
  )
}

export function QueryList(props: ListProps) {
  return (
    <Suspense fallback={<ListView {...props} selected="" page={1} />}>
      <ListFromAddress {...props} />
    </Suspense>
  )
}
