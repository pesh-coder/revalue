import * as migration_20261031_130746_initial_schema from './20261031_130746_initial_schema'
import * as migration_20261031_131000_search_indexes from './20261031_131000_search_indexes'
import * as migration_20261031_132539_publication_records from './20261031_132539_publication_records'
import * as migration_20261031_133355_notification_window from './20261031_133355_notification_window'
import * as migration_20261031_134126_editorial_metadata from './20261031_134126_editorial_metadata'

export const migrations = [
  {
    up: migration_20261031_130746_initial_schema.up,
    down: migration_20261031_130746_initial_schema.down,
    name: '20261031_130746_initial_schema',
  },
  {
    up: migration_20261031_131000_search_indexes.up,
    down: migration_20261031_131000_search_indexes.down,
    name: '20261031_131000_search_indexes',
  },
  {
    up: migration_20261031_132539_publication_records.up,
    down: migration_20261031_132539_publication_records.down,
    name: '20261031_132539_publication_records',
  },
  {
    up: migration_20261031_133355_notification_window.up,
    down: migration_20261031_133355_notification_window.down,
    name: '20261031_133355_notification_window',
  },
  {
    up: migration_20261031_134126_editorial_metadata.up,
    down: migration_20261031_134126_editorial_metadata.down,
    name: '20261031_134126_editorial_metadata',
  },
]
