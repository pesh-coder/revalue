import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr'
import { buttonVariants } from '@/components/ui/button'
import type { Catalog } from '@/lib/content-types'

// Search form shared by the cached Resources page and the per-search results page.
export function ResourceSearchForm({
  topics,
  q = '',
  topic = '',
  format = '',
}: {
  topics: Catalog['topics']
  q?: string
  topic?: string
  format?: string
}) {
  return (
    <form
      action="/resources/search"
      className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_1fr_1fr_auto]"
    >
      <div>
        <label htmlFor="resource-search" className="mb-2 block font-semibold">
          Search resources
        </label>
        <div className="relative">
          <MagnifyingGlass
            size={20}
            aria-hidden="true"
            className="absolute top-3.5 left-3 text-muted"
          />
          <input
            id="resource-search"
            name="q"
            defaultValue={q}
            maxLength={200}
            placeholder="Search articles, guides and tools"
            className="min-h-12 w-full rounded-control border border-input-border py-3 pr-3 pl-10 text-body-md"
          />
        </div>
      </div>
      <div>
        <label htmlFor="format" className="mb-2 block font-semibold">
          Format
        </label>
        <select
          id="format"
          name="format"
          defaultValue={format}
          className="min-h-12 w-full rounded-control border border-input-border px-3"
        >
          {['', 'Blog', 'Guide', 'Tools', 'Projects', 'Solutions'].map((f) => (
            <option value={f} key={f}>
              {f || 'All formats'}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="topic" className="mb-2 block font-semibold">
          Topic
        </label>
        <select
          id="topic"
          name="topic"
          defaultValue={topic}
          className="min-h-12 w-full rounded-control border border-input-border px-3"
        >
          <option value="">All topics</option>
          {topics.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.title}
            </option>
          ))}
        </select>
      </div>
      <button className={buttonVariants()} type="submit">
        Search
      </button>
    </form>
  )
}
