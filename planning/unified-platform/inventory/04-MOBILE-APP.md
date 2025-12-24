# Mobile App Architecture - Inventory Management Module

## Document Overview

This document defines the mobile application architecture for the **Inventory Management Module** within the unified **Horizon Systems Mobile Platform**. This is not a standalone app—it's one module in a comprehensive business management suite accessed through a single mobile application.

**Key Principles:**
- Single unified app with multiple business modules
- Offline-first architecture (critical for warehouse operations)
- Native integrations for barcode scanning and device peripherals
- Cross-module data sharing and navigation
- Platform-specific optimizations (iOS/Android)

---

## 1. Unified App Structure

### 1.1 Platform Architecture

```
Horizon Systems Mobile App
│
├── App Shell (Always Loaded)
│   ├── Authentication Layer
│   ├── Navigation Framework
│   ├── Notification Manager
│   ├── Offline Sync Engine
│   └── Module Registry
│
├── Core Services (Shared)
│   ├── User Service
│   ├── Organization Service
│   ├── Notification Service
│   ├── Analytics Service
│   ├── Permission Service
│   └── Storage Service
│
└── Business Modules (Lazy Loaded)
    ├── Inventory Management ← THIS MODULE
    ├── Analytics & Reporting
    ├── People Management
    ├── Real Estate
    ├── Healthcare Operations
    ├── Logistics & Delivery
    └── [Other Modules...]
```

### 1.2 Navigation Hierarchy

**Level 1: Primary Navigation (Bottom Tabs)**
```
┌─────────────────────────────────────┐
│  [Home] [Modules] [Notify] [Profile] │
└─────────────────────────────────────┘
```

- **Home Tab**: Unified dashboard with widgets from all subscribed modules
- **Modules Tab**: Grid view of all available modules (based on subscription)
- **Notifications Tab**: Aggregated notifications across all modules
- **Profile Tab**: User settings, organization switcher, preferences

**Level 2: Module Navigation (Inventory)**

When user taps Inventory module:
```
Inventory Module
├── Dashboard       # Stock alerts, tasks, quick stats
├── Scan           # Camera scanning interface (main action)
├── Tasks          # Receiving, picking, counting assignments
├── Browse         # Products, locations, categories
└── Reports        # Module-specific insights
```

**Level 3: Detail Views**

Stack navigation within each section:
```
Scan → Product Detail → Stock Adjustment → Confirmation
Browse → Product List → Product Detail → Location Map
Tasks → Pick Order → Item List → Scan Items → Complete
```

### 1.3 Module Switcher UI

Accessible from any screen via:
- **Swipe gesture** from left edge (iOS) or right edge (Android)
- **Module icon** in header (when inside a module)
- **Quick switch drawer** (floating button)

**Module Switcher Features:**
- Recently accessed modules at top
- Notification badges per module
- Search/filter for organizations with many modules
- Module status indicators (syncing, offline, error)
- Module subscriptions and permissions display

### 1.4 App Entry Points

**Deep Linking Structure:**
```
horizon://module/screen/params

Examples:
horizon://inventory/product/12345
horizon://inventory/scan?mode=receiving
horizon://inventory/tasks/pick/order-789
horizon://analytics/dashboard?filter=inventory
```

**Universal Links (iOS) / App Links (Android):**
```
https://app.horizonsystems.com/inventory/product/12345
https://app.horizonsystems.com/inventory/scan
```

---

## 2. Inventory Module Features

### 2.1 Barcode/QR Scanning (Core Feature)

**Scanner Interface:**
```
┌─────────────────────────────────────┐
│  [<] Scanning Mode    [Flash] [...]  │
│                                       │
│    ┌─────────────────────────┐      │
│    │                         │      │
│    │   [Camera Viewfinder]   │      │
│    │                         │      │
│    │   [Scan Target Frame]   │      │
│    │                         │      │
│    └─────────────────────────┘      │
│                                       │
│  Last Scanned: Widget ABC (x3)       │
│  [Undo] [Manual Entry]               │
│                                       │
│  ┌─────────────────────────────┐    │
│  │ Recent Scans                │    │
│  │ • Widget ABC x3             │    │
│  │ • Gadget XYZ x1             │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**Scanning Modes:**
- **Continuous Scan**: Keep camera open, scan multiple items rapidly
- **Single Scan**: Scan once and review before next
- **Batch Scan**: Scan same item multiple times to build quantity
- **Paired Scan**: Scan item then location (for put-away)

**Scanning Features:**
- Supported formats: UPC, EAN, Code 128, Code 39, QR, Data Matrix
- Auto-detect barcode format
- Haptic + sound + visual feedback on successful scan
- Vibration pattern different for success vs. error
- Flashlight toggle for low-light environments
- Manual entry fallback (damaged barcodes)
- Scan history with undo capability
- Works 100% offline (queues actions for sync)

**Context-Aware Scanning:**

The scanner behavior adapts based on context:
- **Receiving Mode**: Scan PO, then items, verify against expected quantities
- **Picking Mode**: Scan order, navigate to items, verify picks
- **Counting Mode**: Scan location, then all items in location
- **Lookup Mode**: General product search by barcode
- **Transfer Mode**: Scan item, scan source location, scan destination

**Error Handling:**
- **Product not found**: Offer to create product or search similar SKUs
- **Wrong location**: Alert user if item scanned at unexpected location
- **Quantity mismatch**: Highlight discrepancies in receiving/picking
- **Duplicate scan**: Confirm if user intended to scan same item again
- **Invalid barcode**: Suggest manual entry or photo capture for support

### 2.2 Stock Lookup & Management

**Search Interface:**
```
┌─────────────────────────────────────┐
│  [≡]  Search Inventory      [Scan]  │
├─────────────────────────────────────┤
│  🔍  Search by name, SKU, barcode   │
├─────────────────────────────────────┤
│  [All] [Low Stock] [Overstock]      │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │ Widget ABC          [Photo] │   │
│  │ SKU: WDG-001               │   │
│  │ Stock: 45 units    ⚠️ Low   │   │
│  │ Location: A-01-05          │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ Gadget XYZ          [Photo] │   │
│  │ SKU: GDG-002               │   │
│  │ Stock: 234 units   ✓ Good  │   │
│  │ Location: B-03-12          │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Search Capabilities:**
- **Full-text search**: Product name, SKU, barcode, description
- **Filters**: Category, location, stock status, supplier
- **Sorting**: A-Z, stock level, value, last updated
- **Works offline**: Search local SQLite database
- **Fuzzy matching**: Handle typos and partial matches
- **Recent searches**: Quick access to previous searches
- **Voice search**: Hands-free operation

**Product Detail Screen:**
```
┌─────────────────────────────────────┐
│  [<] Widget ABC               [···] │
├─────────────────────────────────────┤
│  [Product Image]                     │
│  SKU: WDG-001  |  Barcode: 12345678 │
├─────────────────────────────────────┤
│  Current Stock                       │
│  ┌─────────────────────────────┐   │
│  │  45 units     ⚠️ Below Min    │   │
│  │  Min: 50  |  Max: 200        │   │
│  └─────────────────────────────┘   │
│                                      │
│  Locations (3)                       │
│  • A-01-05: 25 units                │
│  • A-01-06: 15 units                │
│  • B-02-03: 5 units                 │
│                                      │
│  Quick Actions                       │
│  [Adjust Stock] [Transfer] [Reorder]│
│                                      │
│  Recent Activity (Last 7 days)      │
│  • Dec 15: -10 units (Picked)       │
│  • Dec 14: +50 units (Received)     │
│  • Dec 12: Cycle Count (Variance: 0)│
└─────────────────────────────────────┘
```

**Quick Actions:**
- **Adjust Stock**: Add/remove quantities with reason codes
- **Transfer**: Move stock between locations
- **View History**: Complete transaction log
- **Reorder**: Create purchase order (if integrated with purchasing module)
- **Set Alerts**: Configure min/max thresholds
- **Share**: Export product info or share via cross-module integration

### 2.3 Receiving Goods

**Receiving Workflow:**

1. **Start Receiving Session**
   - Scan or select Purchase Order
   - View expected items and quantities
   - Review supplier and expected delivery date

2. **Scan Items**
   - Continuous scanning mode
   - Real-time comparison: expected vs. received
   - Visual indicators for matches, overages, shortages

3. **Handle Discrepancies**
   - Report shortages (partial delivery)
   - Report overages (quantity mismatch)
   - Report damage (with photo capture)
   - Add notes for each discrepancy

4. **Assign Locations**
   - Scan or select bin location for each item
   - Support for split quantities across locations
   - Warehouse map visualization (if available)

5. **Confirm & Close**
   - Review summary of received items
   - Print receiving labels (if printer connected)
   - Update stock levels
   - Generate receiving report

**Receiving Interface:**
```
┌─────────────────────────────────────┐
│  [<] Receiving PO-12345              │
├─────────────────────────────────────┤
│  Progress: 3 of 5 items completed    │
│  ████████░░░░░░ 60%                  │
├─────────────────────────────────────┤
│  Scan items to receive:              │
│                                       │
│  ✓ Widget ABC                        │
│    Expected: 50  |  Received: 50     │
│    Location: A-01-05                 │
│                                       │
│  ✓ Gadget XYZ                        │
│    Expected: 100  |  Received: 95    │
│    ⚠️ Short: 5 units (damaged)        │
│    Location: B-03-12                 │
│                                       │
│  ⏳ Thingamajig                       │
│    Expected: 25  |  Received: 0      │
│    [Scan to receive]                 │
│                                       │
│  [Continue Scanning]                 │
│  [Complete Receiving]                │
└─────────────────────────────────────┘
```

**Partial Receiving:**
- Save receiving session as "In Progress"
- Resume later (handles multi-day deliveries)
- Multiple users can receive same PO (different items)
- Sync state across devices

**Photo Capture:**
- Take photos of damaged items
- Capture packing slip/delivery documents
- Attach photos to receiving record
- Auto-sync photos to Supabase Storage when online

### 2.4 Picking & Packing

**Pick Workflow:**

1. **View Assigned Orders**
   - List of orders ready for picking
   - Sorted by priority, ship date, or pick path optimization
   - Filter by status, customer, warehouse zone

2. **Start Pick Session**
   - Select order(s) to pick (batch picking supported)
   - View optimized pick path
   - Generate pick list

3. **Navigate & Pick**
   - Guided navigation to each location
   - Scan location to confirm correct bin
   - Scan item to confirm correct product
   - Enter quantity picked
   - Mark items as picked or short

4. **Handle Shorts & Substitutions**
   - Report out-of-stock items
   - Suggest substitutions (if configured)
   - Flag for backorder processing

5. **Pack & Verify**
   - Scan items before placing in box
   - Verify all items packed
   - Print packing slip and shipping label
   - Complete order

**Picking Interface (Optimized Path):**
```
┌─────────────────────────────────────┐
│  [<] Picking Order #789              │
├─────────────────────────────────────┤
│  Customer: Acme Corp                 │
│  Items: 4  |  Total Units: 15        │
│  Progress: 2 of 4 items              │
├─────────────────────────────────────┤
│  Current Item:                       │
│  ┌─────────────────────────────┐   │
│  │ Widget ABC          [Photo] │   │
│  │ SKU: WDG-001               │   │
│  │ Quantity: 5 units          │   │
│  │ Location: A-01-05 ➡️        │   │
│  │                            │   │
│  │ [Navigate to Location]     │   │
│  │ [Scan Item]                │   │
│  └─────────────────────────────┘   │
│                                      │
│  ✓ Picked:                           │
│  • Gadget XYZ x10 (B-03-12)         │
│  • Thingamajig x3 (C-02-08)         │
│                                      │
│  Remaining:                          │
│  • Widget ABC x5 (A-01-05) ← NOW    │
│  • Gizmo DEF x2 (A-01-07)           │
└─────────────────────────────────────┘
```

**Pick Path Optimization:**
- Algorithm determines most efficient route through warehouse
- Zone-based picking (group by warehouse area)
- FIFO/FEFO enforcement (first-in-first-out / first-expired-first-out)
- Visual map showing pick path

**Batch Picking:**
- Pick multiple orders simultaneously
- Group items by location
- Sort items into orders during packing
- Efficiency gains for high-volume operations

**Packing Verification:**
```
┌─────────────────────────────────────┐
│  [<] Packing Order #789              │
├─────────────────────────────────────┤
│  Scan items to verify before packing│
│                                       │
│  ✓ Widget ABC x5     [Scanned]      │
│  ✓ Gadget XYZ x10    [Scanned]      │
│  ✓ Thingamajig x3    [Scanned]      │
│  ⏳ Gizmo DEF x2      [Pending]      │
│                                       │
│  [Complete Packing]                  │
│  [Print Shipping Label]              │
└─────────────────────────────────────┘
```

### 2.5 Inventory Counting (Cycle Counts)

**Count Types:**
- **Full Count**: Count all items in warehouse
- **Cycle Count**: Count specific locations on rotation
- **Spot Check**: Random verification counts
- **Annual Count**: Year-end physical inventory

**Counting Workflow:**

1. **Create/Assign Count**
   - Select count type and scope
   - Assign to specific users (if manager)
   - Set deadline and priority

2. **Execute Count**
   - Navigate to location(s)
   - Scan location barcode to start
   - Scan all items in location
   - Enter quantities (blind count option)

3. **Review Variances**
   - Compare counted vs. system quantities
   - Highlight discrepancies
   - Add notes explaining variances
   - Capture photos if needed

4. **Approve & Adjust**
   - Manager reviews variances
   - Approve adjustments
   - Update system quantities
   - Generate count report

**Counting Interface (Blind Count):**
```
┌─────────────────────────────────────┐
│  [<] Cycle Count: Zone A             │
├─────────────────────────────────────┤
│  Location: A-01-05                   │
│  Status: Counting...                 │
├─────────────────────────────────────┤
│  Scan all items in this location:    │
│                                       │
│  Counted Items:                      │
│  • Widget ABC x 23                   │
│  • Gadget XYZ x 12                   │
│  • [Scan next item]                  │
│                                       │
│  [Complete Location]                 │
│  [Skip Location]                     │
│  [Add Manual Entry]                  │
└─────────────────────────────────────┘
```

**After Count Submission:**
```
┌─────────────────────────────────────┐
│  [<] Count Review: A-01-05           │
├─────────────────────────────────────┤
│  Variances Detected:                 │
│                                       │
│  ⚠️ Widget ABC                        │
│    System: 25  |  Counted: 23        │
│    Variance: -2 units (-8%)          │
│    [Add Note] [Recount] [Approve]    │
│                                       │
│  ✓ Gadget XYZ                        │
│    System: 12  |  Counted: 12        │
│    Variance: 0 (Perfect match!)      │
│                                       │
│  [Submit All] [Review Next Location] │
└─────────────────────────────────────┘
```

**Count Analytics:**
- Count accuracy by user
- Variance trends over time
- High-variance products flagged
- Count frequency recommendations

### 2.6 Warehouse Navigation

**Features:**
- Interactive warehouse map (if geospatial data available)
- Turn-by-turn directions to bins
- Location search and filtering
- Aisle/zone visualization
- GPS-based positioning (for large warehouses)
- Indoor positioning (if beacons deployed)

**Location Map:**
```
┌─────────────────────────────────────┐
│  [<] Warehouse Map         [Filter] │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │     Warehouse Layout        │   │
│  │                             │   │
│  │  ┌────┐ ┌────┐ ┌────┐      │   │
│  │  │ A  │ │ B  │ │ C  │      │   │
│  │  │Zone│ │Zone│ │Zone│      │   │
│  │  │ 📍 │ │    │ │    │      │   │
│  │  └────┘ └────┘ └────┘      │   │
│  │                             │   │
│  │  You are here: Zone A       │   │
│  │  Navigate to: A-01-05       │   │
│  └─────────────────────────────┘   │
│                                      │
│  Current Location: A-01-03           │
│  Target Location: A-01-05            │
│  Distance: 15 feet                   │
│                                      │
│  [Start Navigation]                  │
└─────────────────────────────────────┘
```

---

## 3. Offline-First Architecture

### 3.1 Why Offline-First is Critical

Warehouse environments often have:
- Poor cellular coverage (metal structures, concrete walls)
- Dead zones in specific areas
- Unreliable WiFi in large facilities
- Need for uninterrupted operations during network outages

**Requirements:**
- 100% functionality offline for core features
- Instant response to user actions (no network delays)
- Seamless sync when network becomes available
- No data loss during offline periods
- Conflict resolution for simultaneous edits

### 3.2 Local Database Architecture

**Technology: SQLite with SQLCipher Encryption**

**Database Schema:**

```sql
-- Products Table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  barcode TEXT,
  category_id TEXT,
  supplier_id TEXT,
  unit_price REAL,
  currency TEXT DEFAULT 'USD',
  min_stock INTEGER,
  max_stock INTEGER,
  reorder_point INTEGER,
  image_url TEXT,
  metadata TEXT, -- JSON blob for flexible attributes
  created_at INTEGER,
  updated_at INTEGER,
  synced_at INTEGER,
  is_deleted INTEGER DEFAULT 0
);

CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_category ON products(category_id);
CREATE VIRTUAL TABLE products_fts USING fts5(name, description, sku);

-- Locations Table (Bins/Shelves)
CREATE TABLE locations (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL, -- A-01-05
  aisle TEXT,
  zone TEXT,
  level INTEGER,
  type TEXT, -- shelf, pallet, bin
  capacity REAL,
  gps_lat REAL,
  gps_lng REAL,
  metadata TEXT,
  created_at INTEGER,
  updated_at INTEGER,
  synced_at INTEGER,
  is_deleted INTEGER DEFAULT 0
);

CREATE INDEX idx_locations_warehouse ON locations(warehouse_id);
CREATE INDEX idx_locations_zone ON locations(zone);

-- Stock Levels Table
CREATE TABLE stock_levels (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  location_id TEXT NOT NULL,
  quantity REAL NOT NULL DEFAULT 0,
  reserved_quantity REAL DEFAULT 0,
  available_quantity REAL GENERATED ALWAYS AS (quantity - reserved_quantity),
  last_counted_at INTEGER,
  updated_at INTEGER,
  synced_at INTEGER,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (location_id) REFERENCES locations(id),
  UNIQUE(product_id, location_id)
);

CREATE INDEX idx_stock_product ON stock_levels(product_id);
CREATE INDEX idx_stock_location ON stock_levels(location_id);

-- Transactions Table (Audit Log)
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL, -- RECEIVE, PICK, ADJUST, TRANSFER, COUNT
  product_id TEXT NOT NULL,
  location_id TEXT,
  quantity_change REAL NOT NULL,
  quantity_before REAL,
  quantity_after REAL,
  reference_id TEXT, -- Order ID, PO ID, Count ID
  reference_type TEXT,
  user_id TEXT NOT NULL,
  reason_code TEXT,
  notes TEXT,
  metadata TEXT,
  created_at INTEGER NOT NULL,
  synced_at INTEGER,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (location_id) REFERENCES locations(id)
);

CREATE INDEX idx_transactions_product ON transactions(product_id);
CREATE INDEX idx_transactions_created ON transactions(created_at);
CREATE INDEX idx_transactions_synced ON transactions(synced_at);

-- Offline Queue Table
CREATE TABLE offline_queue (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL DEFAULT 'inventory',
  action TEXT NOT NULL, -- CREATE, UPDATE, DELETE
  entity_type TEXT NOT NULL, -- product, transaction, stock_level
  entity_id TEXT NOT NULL,
  payload TEXT NOT NULL, -- JSON
  timestamp INTEGER NOT NULL,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  status TEXT DEFAULT 'pending', -- pending, processing, failed, completed
  error_message TEXT,
  dependencies TEXT, -- JSON array of queue item IDs
  created_at INTEGER NOT NULL
);

CREATE INDEX idx_queue_status ON offline_queue(status);
CREATE INDEX idx_queue_timestamp ON offline_queue(timestamp);
CREATE INDEX idx_queue_module ON offline_queue(module_id);

-- Sync Metadata Table
CREATE TABLE sync_metadata (
  entity_type TEXT PRIMARY KEY,
  last_synced_at INTEGER,
  last_sync_token TEXT,
  pending_changes INTEGER DEFAULT 0
);
```

**Database Size Management:**
- Automatic purging of old transactions (keep last 90 days)
- Image caching with TTL and size limits
- VACUUM database on app start (if not done in 7 days)
- Monitor database size, warn if approaching 500MB

### 3.3 Offline Data Strategy

**What's Stored Locally:**

**Always Cached (High Priority):**
- Complete product catalog (SKU, name, barcode, basic info)
- All locations in user's assigned warehouse(s)
- Current stock levels for all products
- User's assigned tasks (receiving, picking, counting)
- Recent transactions (last 30 days)
- User profile and permissions

**Conditionally Cached (Medium Priority):**
- Product images (progressive loading)
- Purchase orders (recent and upcoming)
- Historical analytics (last 90 days)
- Supplier information

**Never Cached (Fetch on Demand):**
- Real-time analytics across all warehouses
- System-wide reports
- User management (other users)
- Audit logs (beyond 90 days)

**Initial Sync (First App Launch):**
1. Authenticate user
2. Download organization and module subscriptions
3. Download warehouse assignments
4. Background fetch product catalog (show progress)
5. Download locations and current stock
6. Download pending tasks
7. App ready for offline use

**Incremental Sync (Subsequent Syncs):**
- Only fetch data modified since last sync
- Use `lastSyncedAt` timestamps per entity type
- Delta sync reduces data transfer by 90%+
- Prioritize critical data (pending tasks, stock changes)

### 3.4 Sync Strategy

**Sync Triggers:**

1. **App Foreground** (Immediate)
   - When app comes to foreground
   - Upload offline queue first
   - Then download server changes

2. **Network Reconnection** (Immediate)
   - Detect network state change
   - Trigger full sync cycle

3. **Background Sync** (Scheduled)
   - Every 15 minutes if online (iOS Background Fetch / Android WorkManager)
   - Battery-aware (pause if battery < 20%)

4. **Manual Refresh** (Pull-to-Refresh)
   - User-triggered sync
   - Force refresh of current screen data

5. **Post-Action Sync** (Event-Based)
   - After completing critical workflows (receiving, picking)
   - Ensure data reaches server ASAP

**Sync Priority Queue:**

```typescript
interface SyncPriority {
  priority: 'critical' | 'high' | 'medium' | 'low';
  entityType: string;
  syncDirection: 'upload' | 'download' | 'bidirectional';
}

const SYNC_PRIORITIES: SyncPriority[] = [
  // Upload user actions first
  { priority: 'critical', entityType: 'transactions', syncDirection: 'upload' },
  { priority: 'critical', entityType: 'stock_adjustments', syncDirection: 'upload' },

  // Download critical updates
  { priority: 'high', entityType: 'tasks', syncDirection: 'download' },
  { priority: 'high', entityType: 'stock_levels', syncDirection: 'download' },

  // Bidirectional sync
  { priority: 'medium', entityType: 'products', syncDirection: 'bidirectional' },
  { priority: 'medium', entityType: 'locations', syncDirection: 'bidirectional' },

  // Low priority
  { priority: 'low', entityType: 'analytics', syncDirection: 'download' },
  { priority: 'low', entityType: 'reports', syncDirection: 'download' }
];
```

**Sync Algorithm:**

```typescript
async function performSync() {
  // 1. Check network connectivity
  if (!isOnline()) {
    logger.info('Offline - skipping sync');
    return;
  }

  // 2. Process offline queue (uploads)
  await processOfflineQueue();

  // 3. Download server changes (downloads)
  for (const priority of ['critical', 'high', 'medium', 'low']) {
    const entities = SYNC_PRIORITIES.filter(p => p.priority === priority);

    for (const entity of entities) {
      if (entity.syncDirection === 'download' || entity.syncDirection === 'bidirectional') {
        await downloadChanges(entity.entityType);
      }
    }

    // Check if still online, exit if not
    if (!isOnline()) {
      logger.info('Lost connection during sync');
      return;
    }
  }

  // 4. Update sync metadata
  await updateSyncMetadata();

  // 5. Notify UI of successful sync
  dispatch(syncCompleted());
}
```

### 3.5 Conflict Resolution

**Conflict Types:**

**1. Stock Level Conflicts**
- **Scenario**: Device A adjusts stock to 50, Device B adjusts to 45 (simultaneously offline)
- **Resolution**:
  - For absolute adjustments: Server value wins (last-write-wins with timestamp)
  - For relative adjustments: Apply delta (+5 and -5 = net 0)
  - Use operational transformation for complex scenarios

**2. Product Metadata Conflicts**
- **Scenario**: Device A updates product name, Device B updates price
- **Resolution**:
  - Field-level merging (both changes applied)
  - Last-write-wins per field (using field-level timestamps)
  - If same field edited: Show conflict resolution UI to user

**3. Location Conflicts**
- **Scenario**: Device A moves product to Bin A-05, Device B moves to Bin A-07
- **Resolution**:
  - Server wins (location changes must be authoritative)
  - Notify user of conflict and current location
  - Offer to create new transfer transaction

**4. Transaction Log Conflicts**
- **Scenario**: Should never happen (append-only log)
- **Resolution**:
  - Accept all transactions from both devices
  - Flag suspicious patterns (duplicate scans) for review
  - Audit log for investigation

**Conflict Resolution UI:**

```
┌─────────────────────────────────────┐
│  ⚠️ Sync Conflict Detected           │
├─────────────────────────────────────┤
│  Product: Widget ABC                 │
│  Field: Price                        │
│                                       │
│  Your Change (2 min ago):            │
│  $19.99                               │
│                                       │
│  Server Value (1 min ago):           │
│  $21.99 (updated by John Doe)        │
│                                       │
│  [Keep Mine] [Use Server] [View Both]│
└─────────────────────────────────────┘
```

**Automatic Resolution Rules:**

```typescript
const CONFLICT_RULES = {
  stock_levels: {
    strategy: 'delta_apply', // Apply relative changes
    serverWins: false
  },
  product_price: {
    strategy: 'last_write_wins',
    serverWins: true
  },
  product_metadata: {
    strategy: 'field_merge',
    serverWins: false
  },
  location_assignments: {
    strategy: 'server_wins',
    serverWins: true
  },
  transactions: {
    strategy: 'append_both',
    serverWins: false
  }
};
```

### 3.6 Offline Queue Management

**Queue Item Structure:**

```typescript
interface OfflineQueueItem {
  id: string; // UUID
  moduleId: 'inventory' | 'analytics' | 'people' | ...;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'product' | 'transaction' | 'stock_level' | 'location';
  entityId: string;
  payload: any; // Full entity data
  timestamp: number; // When action was performed
  retryCount: number;
  maxRetries: number;
  status: 'pending' | 'processing' | 'failed' | 'completed';
  errorMessage?: string;
  dependencies?: string[]; // Other queue items that must succeed first
  createdAt: number;
}
```

**Queue Processing:**

```typescript
async function processOfflineQueue() {
  // Get all pending items, ordered by timestamp
  const queueItems = await getQueueItems({ status: 'pending', orderBy: 'timestamp' });

  for (const item of queueItems) {
    // Check dependencies
    if (item.dependencies && item.dependencies.length > 0) {
      const depsCompleted = await checkDependencies(item.dependencies);
      if (!depsCompleted) {
        continue; // Skip this item, process later
      }
    }

    try {
      // Mark as processing
      await updateQueueItem(item.id, { status: 'processing' });

      // Execute sync operation
      await executeSyncOperation(item);

      // Mark as completed
      await updateQueueItem(item.id, { status: 'completed' });

      // Remove from queue after 24 hours (for debugging)
      scheduleQueueCleanup(item.id, 24 * 60 * 60 * 1000);

    } catch (error) {
      // Handle error
      if (isTransientError(error)) {
        // Network error, retry later
        await updateQueueItem(item.id, {
          status: 'pending',
          retryCount: item.retryCount + 1,
          errorMessage: error.message
        });

        if (item.retryCount >= item.maxRetries) {
          // Max retries exceeded, mark as failed
          await updateQueueItem(item.id, { status: 'failed' });
          await notifyUser(`Sync failed: ${item.entityType} ${item.action}`);
        }
      } else {
        // Permanent error (validation, permission)
        await updateQueueItem(item.id, {
          status: 'failed',
          errorMessage: error.message
        });
        await notifyUser(`Action failed: ${error.message}`);
      }
    }
  }
}
```

**Retry Strategy (Exponential Backoff):**

```typescript
function calculateRetryDelay(retryCount: number): number {
  const baseDelay = 1000; // 1 second
  const maxDelay = 60000; // 60 seconds
  const delay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);
  return delay;
}

// Retry schedule:
// Attempt 1: Immediate
// Attempt 2: 1 second later
// Attempt 3: 2 seconds later
// Attempt 4: 4 seconds later
// ...
// Max: 60 seconds between attempts
```

**Queue Monitoring:**

UI indicator showing offline queue status:

```
┌─────────────────────────────────────┐
│  📶 Offline (3 actions pending)      │
│  [Tap to view details]               │
└─────────────────────────────────────┘

When tapped:
┌─────────────────────────────────────┐
│  Pending Sync Actions                │
├─────────────────────────────────────┤
│  • Stock adjustment: Widget ABC      │
│    2 minutes ago                     │
│                                       │
│  • Product scan: Gadget XYZ          │
│    5 minutes ago                     │
│                                       │
│  • Location transfer: Thingamajig    │
│    12 minutes ago                    │
│                                       │
│  [Sync Now] [View All]               │
└─────────────────────────────────────┘
```

---

## 4. Shared Platform Features

### 4.1 Single Authentication

**Authentication Flow:**

```
User Opens App
  ↓
Check Saved Session
  ↓
Session Valid? → Yes → Load App Shell
  ↓ No
Show Login Screen
  ↓
Enter Email/Password (or Biometric)
  ↓
Supabase Auth (supabase.auth.signInWithPassword)
  ↓
Receive JWT Token
  ↓
Store Token Securely (Keychain/Keystore)
  ↓
Fetch User Profile & Organization
  ↓
Fetch Module Subscriptions
  ↓
Load App Shell
  ↓
User Can Access All Subscribed Modules
```

**Login Screen:**

```
┌─────────────────────────────────────┐
│                                       │
│      [Horizon Systems Logo]          │
│                                       │
│      Manage Everything. Anywhere.    │
│                                       │
│  ┌─────────────────────────────┐    │
│  │ Email                       │    │
│  │ john@acme.com              │    │
│  └─────────────────────────────┘    │
│                                       │
│  ┌─────────────────────────────┐    │
│  │ Password                    │    │
│  │ ••••••••••                  │    │
│  └─────────────────────────────┘    │
│                                       │
│  [✓] Remember me                     │
│                                       │
│  ┌─────────────────────────────┐    │
│  │       Sign In               │    │
│  └─────────────────────────────┘    │
│                                       │
│  [Sign in with Face ID 👤]           │
│                                       │
│  Forgot password? • Sign up          │
└─────────────────────────────────────┘
```

**Authentication Methods:**
- Email/Password
- Social Login (Google, Microsoft, Apple)
- Single Sign-On (SSO) for enterprise clients
- Magic Link (passwordless)
- Biometric (Face ID, Touch ID, Fingerprint)

**Token Management:**

```typescript
// Token structure
interface AuthToken {
  accessToken: string;    // JWT, expires in 1 hour
  refreshToken: string;   // Long-lived, 30 days
  expiresAt: number;      // Unix timestamp
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    organizationId: string;
  };
}

// Auto-refresh before expiry
async function ensureValidToken() {
  const token = await getToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const now = Date.now();
  const expiresIn = token.expiresAt - now;

  // Refresh if expiring in next 5 minutes
  if (expiresIn < 5 * 60 * 1000) {
    const newToken = await refreshAuthToken(token.refreshToken);
    await saveToken(newToken);
    return newToken;
  }

  return token;
}
```

**Session Persistence:**
- Token stored in secure storage (Keychain/Keystore)
- Session persists across app restarts
- Biometric quick re-auth (configurable timeout)
- Auto-logout after 30 days of inactivity

### 4.2 Push Notifications (Unified)

**Notification Service Architecture:**

```
Supabase Database (notifications table)
  ↓
Supabase Edge Function (notification router)
  ↓
Firebase Cloud Messaging (FCM) / APNs
  ↓
Mobile Device
  ↓
App Notification Handler
  ↓
Module-Specific Handler (if app open)
```

**Notification Payload:**

```json
{
  "notification": {
    "title": "Low Stock Alert",
    "body": "Widget ABC has only 5 units left",
    "sound": "default",
    "badge": "increment"
  },
  "data": {
    "notificationId": "notif-12345",
    "moduleId": "inventory",
    "type": "low_stock_alert",
    "priority": "high",
    "entityType": "product",
    "entityId": "prod-789",
    "deepLink": "horizon://inventory/product/prod-789",
    "timestamp": "2025-01-15T10:30:00Z",
    "actionable": true,
    "actions": [
      { "id": "view", "title": "View Product" },
      { "id": "reorder", "title": "Reorder Now" },
      { "id": "dismiss", "title": "Dismiss" }
    ]
  }
}
```

**Notification Types by Module:**

**Inventory:**
- Low stock alerts
- Reorder point reached
- Expiry date warnings (3 days, 7 days, 30 days)
- New receiving tasks assigned
- Picking tasks ready
- Cycle count scheduled/due
- Stock discrepancy detected
- Transfer completed

**Analytics:**
- Weekly/monthly reports ready
- KPI thresholds crossed
- Anomaly detected

**People Management:**
- Shift starting soon
- Timesheet approval needed
- New team member added

**Orders/Sales:**
- New order requires fulfillment
- Order ready for pickup
- Payment received

**Notification Grouping:**

```
[Notification Tray]

Inventory (3)
  • Low Stock: Widget ABC
  • Task Assigned: Receive PO-12345
  • Cycle Count Due: Zone A

Analytics (1)
  • Weekly Report Ready

People (2)
  • Shift starts in 30 minutes
  • Timesheet needs approval
```

**Actionable Notifications:**

iOS/Android support notification actions without opening app:

```
┌─────────────────────────────────────┐
│ Low Stock Alert - Inventory         │
│ Widget ABC has only 5 units left    │
│ 2 minutes ago                        │
│                                       │
│ [View Product] [Reorder] [Dismiss]  │
└─────────────────────────────────────┘
```

**Notification Settings:**

```
┌─────────────────────────────────────┐
│  [<] Notification Settings           │
├─────────────────────────────────────┤
│  Push Notifications        [Toggle]  │
│  Badge Icon               [Toggle]  │
│  Sound                    [Toggle]  │
│                                       │
│  By Module:                           │
│                                       │
│  Inventory                [Toggle]  │
│    • Low stock alerts     [Toggle]  │
│    • Task assignments     [Toggle]  │
│    • Expiry warnings      [Toggle]  │
│    • Discrepancies        [Toggle]  │
│                                       │
│  Analytics                [Toggle]  │
│    • Reports ready        [Toggle]  │
│    • Threshold alerts     [Toggle]  │
│                                       │
│  Quiet Hours                          │
│    From: 10:00 PM  To: 7:00 AM       │
│    [✓] Enable quiet hours             │
│                                       │
│  Priority Filter                      │
│    [High] [Medium] [Low]             │
└─────────────────────────────────────┘
```

**Local Notifications:**

For offline operations, the app can schedule local notifications:

```typescript
// Schedule local notification
import notifee from '@notifee/react-native';

async function scheduleLocalNotification() {
  await notifee.requestPermission();

  await notifee.createTriggerNotification(
    {
      title: 'Cycle Count Reminder',
      body: 'Zone A cycle count is due today',
      android: {
        channelId: 'inventory',
        smallIcon: 'ic_notification',
      },
      ios: {
        sound: 'default',
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: Date.now() + 2 * 60 * 60 * 1000, // 2 hours from now
    }
  );
}
```

### 4.3 Settings & Profile (Shared)

**Profile Screen:**

```
┌─────────────────────────────────────┐
│  [<] Profile                  [Edit] │
├─────────────────────────────────────┤
│         [Profile Photo]              │
│         John Doe                     │
│         john@acme.com                │
│         Warehouse Manager            │
├─────────────────────────────────────┤
│  Organization                         │
│  Acme Corporation              [>]   │
│                                       │
│  Assigned Warehouses                 │
│  • Main Warehouse (Primary)          │
│  • Distribution Center North         │
│                                       │
│  Subscribed Modules (5)              │
│  • Inventory Management              │
│  • Analytics & Reporting             │
│  • People Management                 │
│  • Real Estate                       │
│  • Logistics & Delivery              │
│                                       │
│  ┌─────────────────────────────┐    │
│  │ Settings                    │    │
│  ├─────────────────────────────┤    │
│  │ Notifications          [>]  │    │
│  │ Security & Privacy     [>]  │    │
│  │ Appearance             [>]  │    │
│  │ Language & Region      [>]  │    │
│  │ Data & Storage         [>]  │    │
│  │ Help & Support         [>]  │    │
│  │ About                  [>]  │    │
│  └─────────────────────────────┘    │
│                                       │
│  ┌─────────────────────────────┐    │
│  │      Sign Out               │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**Settings Categories:**

**1. Security & Privacy**
- Biometric authentication toggle
- Auto-lock timeout (1 min, 5 min, 15 min, never)
- Two-factor authentication
- Change password
- Active sessions (view/revoke)
- Privacy policy & terms

**2. Appearance**
- Theme: Light, Dark, System Default
- Text size: Small, Medium, Large, Extra Large
- Color scheme (for accessibility)

**3. Language & Region**
- Language selection
- Date format
- Time format (12h/24h)
- Currency
- Measurement units

**4. Data & Storage**
- Offline data management
  - View storage usage
  - Clear cache
  - Re-download product catalog
  - Purge old transactions
- Download quality (images)
  - High (WiFi only)
  - Medium (WiFi + Cellular)
  - Low (Always)
- Auto-sync settings
  - WiFi only
  - WiFi + Cellular
  - Manual only

**5. Help & Support**
- FAQ
- Contact support
- Report a bug
- Feature request
- Video tutorials
- User guide (PDF)

**6. About**
- App version
- Build number
- Last updated
- Terms of service
- Privacy policy
- Open source licenses
- Debug info (for support)

### 4.4 Module Subscriptions

**Subscription Management:**

Organizations subscribe to specific modules. Users see only subscribed modules.

**Module Registry (Global State):**

```typescript
interface ModuleSubscription {
  moduleId: string;
  moduleName: string;
  icon: string;
  enabled: boolean;
  permissions: string[];
  features: string[];
  expiresAt?: number; // Trial expiry
  usage?: {
    users: number;
    maxUsers: number;
    storage: number;
    maxStorage: number;
  };
}

// Example:
const subscriptions: ModuleSubscription[] = [
  {
    moduleId: 'inventory',
    moduleName: 'Inventory Management',
    icon: 'warehouse',
    enabled: true,
    permissions: ['view', 'edit', 'delete', 'manage'],
    features: ['barcode_scanning', 'receiving', 'picking', 'cycle_counts'],
    expiresAt: null, // Unlimited
    usage: {
      users: 15,
      maxUsers: 50,
      storage: 2.5e9, // 2.5 GB
      maxStorage: 10e9 // 10 GB
    }
  },
  {
    moduleId: 'analytics',
    moduleName: 'Analytics & Reporting',
    icon: 'bar-chart',
    enabled: true,
    permissions: ['view'],
    features: ['dashboards', 'reports', 'exports'],
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 day trial
  }
];
```

**Module Access Control:**

```typescript
// Check if user has access to module
function hasModuleAccess(moduleId: string): boolean {
  const subscription = subscriptions.find(s => s.moduleId === moduleId);
  return subscription && subscription.enabled;
}

// Check if user has specific permission in module
function hasModulePermission(moduleId: string, permission: string): boolean {
  const subscription = subscriptions.find(s => s.moduleId === moduleId);
  return subscription && subscription.permissions.includes(permission);
}

// Navigation guard
function navigateToModule(moduleId: string) {
  if (!hasModuleAccess(moduleId)) {
    showUpgradeModal(moduleId);
    return;
  }

  navigation.navigate(`${moduleId}Module`);
}
```

**Upgrade/Trial Expiry UI:**

```
┌─────────────────────────────────────┐
│  Analytics Module - Trial Expired   │
├─────────────────────────────────────┤
│  Your 30-day trial has ended.       │
│  Upgrade to continue using           │
│  advanced analytics and reporting.   │
│                                       │
│  Features included:                  │
│  • Custom dashboards                 │
│  • Automated reports                 │
│  • Data exports                      │
│  • Historical trends                 │
│                                       │
│  Starting at $49/month               │
│                                       │
│  [Upgrade Now] [Contact Sales]       │
│  [Maybe Later]                       │
└─────────────────────────────────────┘
```

---

## 5. Native Integrations

### 5.1 Camera Integration

**Technology Stack:**
- **react-native-vision-camera**: High-performance camera library
- **vision-camera-code-scanner**: Barcode/QR scanning plugin
- **react-native-image-picker**: For photo capture (damage reports)

**Camera Permissions:**

```typescript
import { Camera } from 'react-native-vision-camera';

// Request permission
async function requestCameraPermission() {
  const permission = await Camera.requestCameraPermission();

  if (permission === 'denied') {
    // Show explanation and link to settings
    Alert.alert(
      'Camera Permission Required',
      'Please grant camera access to scan barcodes.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() }
      ]
    );
  }

  return permission === 'granted';
}
```

**Scanner Implementation:**

```typescript
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { Haptics } from 'react-native-haptic-feedback';

function BarcodeScanner() {
  const device = useCameraDevice('back');
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'ean-8', 'code-128', 'code-39', 'upc-a', 'upc-e'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && !scannedCode) {
        const code = codes[0].value;
        setScannedCode(code);

        // Haptic feedback
        Haptics.trigger('impactMedium');

        // Sound feedback
        playSound('scan_success');

        // Process scanned code
        handleScannedCode(code);

        // Reset after 1 second (for continuous scanning)
        setTimeout(() => setScannedCode(null), 1000);
      }
    },
  });

  if (device == null) return <Text>No camera device</Text>;

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />

      {/* Scan overlay */}
      <View style={styles.overlay}>
        <View style={styles.scanFrame} />
        <Text style={styles.instruction}>
          Position barcode within frame
        </Text>
      </View>
    </View>
  );
}
```

**Advanced Camera Features:**

- **Torch/Flashlight**: Toggle for low-light scanning
- **Focus**: Tap-to-focus for damaged/unclear barcodes
- **Zoom**: Pinch-to-zoom for small barcodes
- **Frame rate**: Optimize for battery (30fps vs. 60fps)
- **Photo quality**: High resolution for damage documentation

**Photo Capture (for damage reports):**

```typescript
import { launchCamera } from 'react-native-image-picker';

async function capturePhoto() {
  const result = await launchCamera({
    mediaType: 'photo',
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1920,
    includeBase64: false,
    saveToPhotos: false,
  });

  if (result.assets && result.assets.length > 0) {
    const photo = result.assets[0];

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('damage-reports')
      .upload(`${Date.now()}-${photo.fileName}`, {
        uri: photo.uri,
        type: photo.type,
        name: photo.fileName,
      });

    return data?.path;
  }
}
```

### 5.2 Bluetooth Integration

**Use Cases:**
- External barcode scanners (Zebra, Honeywell, Socket Mobile)
- Bluetooth label printers (Zebra ZD410, Brother QL series)
- RFID readers (for advanced inventory tracking)

**Technology Stack:**
- **react-native-ble-plx**: Bluetooth Low Energy library

**Bluetooth Scanner Pairing:**

```typescript
import { BleManager } from 'react-native-ble-plx';

const bleManager = new BleManager();

async function scanForDevices() {
  const permission = await requestBluetoothPermission();
  if (!permission) return;

  const devices: Device[] = [];

  bleManager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      console.error(error);
      return;
    }

    if (device && device.name) {
      // Filter for known scanner brands
      if (device.name.includes('Zebra') ||
          device.name.includes('Honeywell') ||
          device.name.includes('Socket')) {
        devices.push(device);
      }
    }
  });

  // Stop scanning after 10 seconds
  setTimeout(() => bleManager.stopDeviceScan(), 10000);

  return devices;
}

async function connectToScanner(deviceId: string) {
  const device = await bleManager.connectToDevice(deviceId);
  await device.discoverAllServicesAndCharacteristics();

  // Listen for scan events
  device.monitorCharacteristicForService(
    SCANNER_SERVICE_UUID,
    SCANNER_CHARACTERISTIC_UUID,
    (error, characteristic) => {
      if (characteristic?.value) {
        const barcode = base64Decode(characteristic.value);
        handleScannedCode(barcode);
      }
    }
  );

  return device;
}
```

**Bluetooth Printer:**

```typescript
async function printLabel(printer: Device, labelData: LabelData) {
  const zplCommand = generateZPL(labelData);
  const base64Data = base64Encode(zplCommand);

  await printer.writeCharacteristicWithResponseForService(
    PRINTER_SERVICE_UUID,
    PRINTER_CHARACTERISTIC_UUID,
    base64Data
  );
}

function generateZPL(data: LabelData): string {
  // ZPL (Zebra Programming Language) for label printing
  return `
    ^XA
    ^FO50,50^BY2
    ^BCN,100,Y,N,N
    ^FD${data.barcode}^FS
    ^FO50,200^A0N,30,30^FD${data.productName}^FS
    ^FO50,240^A0N,20,20^FDSKU: ${data.sku}^FS
    ^FO50,270^A0N,20,20^FDLocation: ${data.location}^FS
    ^XZ
  `;
}
```

**Bluetooth Settings UI:**

```
┌─────────────────────────────────────┐
│  [<] Bluetooth Devices               │
├─────────────────────────────────────┤
│  Paired Devices                      │
│                                       │
│  ✓ Zebra CS4070 Scanner              │
│    Connected • Battery 78%           │
│    [Disconnect] [Test Scan]          │
│                                       │
│  ✓ Zebra ZD410 Printer               │
│    Connected                         │
│    [Disconnect] [Print Test]         │
│                                       │
│  Available Devices                   │
│  [Scan for Devices]                  │
│                                       │
│  • Honeywell 1902g                   │
│    [Pair]                            │
│                                       │
│  • Brother QL-820NWB                 │
│    [Pair]                            │
└─────────────────────────────────────┘
```

**Connection Management:**
- Auto-reconnect on app launch
- Monitor connection status
- Handle device disconnection gracefully
- Battery level monitoring (for scanners)
- Maintain connection across app backgrounding

### 5.3 Location Services

**Use Cases:**
- Multi-warehouse organizations (detect which warehouse user is in)
- Warehouse navigation (GPS + indoor positioning)
- Geofencing (auto-switch warehouse context)
- Delivery tracking (logistics module)

**Technology Stack:**
- **@react-native-community/geolocation**: GPS location
- **react-native-geolocation-service**: Enhanced geolocation with background support

**Location Permission:**

```typescript
import Geolocation from '@react-native-community/geolocation';

async function requestLocationPermission() {
  if (Platform.OS === 'ios') {
    const auth = await Geolocation.requestAuthorization('whenInUse'); // or 'always'
    return auth === 'granted';
  } else {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
}
```

**Warehouse Detection:**

```typescript
interface Warehouse {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // meters
}

async function detectCurrentWarehouse(warehouses: Warehouse[]) {
  const position = await getCurrentPosition();

  for (const warehouse of warehouses) {
    const distance = calculateDistance(
      position.coords.latitude,
      position.coords.longitude,
      warehouse.latitude,
      warehouse.longitude
    );

    if (distance <= warehouse.radius) {
      return warehouse;
    }
  }

  return null; // Not at any warehouse
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Haversine formula
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}
```

**Geofencing:**

```typescript
import BackgroundGeolocation from 'react-native-background-geolocation';

async function setupGeofencing(warehouses: Warehouse[]) {
  await BackgroundGeolocation.ready({
    desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    distanceFilter: 50,
    stopOnTerminate: false,
    startOnBoot: true,
  });

  // Add geofences for each warehouse
  for (const warehouse of warehouses) {
    await BackgroundGeolocation.addGeofence({
      identifier: warehouse.id,
      radius: warehouse.radius,
      latitude: warehouse.latitude,
      longitude: warehouse.longitude,
      notifyOnEntry: true,
      notifyOnExit: true,
    });
  }

  // Listen for geofence events
  BackgroundGeolocation.onGeofence(geofence => {
    if (geofence.action === 'ENTER') {
      // User entered warehouse
      dispatch(setActiveWarehouse(geofence.identifier));
      showNotification(`Welcome to ${warehouse.name}`);
    } else if (geofence.action === 'EXIT') {
      // User left warehouse
      dispatch(clearActiveWarehouse());
    }
  });

  BackgroundGeolocation.start();
}
```

**Indoor Positioning (Advanced):**

For large warehouses, use Bluetooth beacons or WiFi triangulation:

```typescript
// Using Bluetooth beacons (iBeacon/Eddystone)
import Beacons from 'react-native-beacons-manager';

async function setupIndoorPositioning() {
  await Beacons.requestWhenInUseAuthorization();

  // Define beacon regions (one per warehouse zone)
  const region = {
    identifier: 'Zone-A',
    uuid: 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0',
  };

  Beacons.startRangingBeaconsInRegion(region);

  Beacons.BeaconsEventEmitter.addListener(
    'beaconsDidRange',
    data => {
      const closestBeacon = data.beacons.reduce((prev, current) =>
        prev.distance < current.distance ? prev : current
      );

      // Update user's zone based on closest beacon
      dispatch(setCurrentZone(closestBeacon.identifier));
    }
  );
}
```

### 5.4 Haptics & Vibration

**Use Cases:**
- Scan success/failure feedback
- Error alerts
- Confirmation for critical actions
- Quantity milestones (every 10th scan)

**Technology Stack:**
- **react-native-haptic-feedback**: Cross-platform haptic feedback

**Implementation:**

```typescript
import Haptics from 'react-native-haptic-feedback';

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

// Success feedback (scan successful)
function scanSuccessFeedback() {
  Haptics.trigger('impactMedium', hapticOptions);
  // or for iOS: Haptics.trigger('notificationSuccess', hapticOptions);
}

// Error feedback (scan failed)
function scanErrorFeedback() {
  Haptics.trigger('notificationError', hapticOptions);
  // or custom vibration pattern
  Vibration.vibrate([0, 100, 50, 100]); // [delay, vibrate, pause, vibrate]
}

// Light feedback (button press)
function buttonPressFeedback() {
  Haptics.trigger('impactLight', hapticOptions);
}

// Heavy feedback (critical action)
function criticalActionFeedback() {
  Haptics.trigger('impactHeavy', hapticOptions);
}

// Selection feedback (picker/slider)
function selectionFeedback() {
  Haptics.trigger('selection', hapticOptions);
}
```

**Haptic Patterns:**

```typescript
// Custom patterns for specific actions
const HAPTIC_PATTERNS = {
  scanSuccess: 'impactMedium',
  scanError: 'notificationError',
  scanMilestone: 'notificationSuccess', // every 10th scan
  taskComplete: 'notificationSuccess',
  warningAlert: 'notificationWarning',
  buttonPress: 'impactLight',
  delete: 'impactHeavy',
};

function triggerHaptic(pattern: keyof typeof HAPTIC_PATTERNS) {
  Haptics.trigger(HAPTIC_PATTERNS[pattern], hapticOptions);
}
```

**User Preferences:**

```
┌─────────────────────────────────────┐
│  [<] Haptic Feedback                 │
├─────────────────────────────────────┤
│  Enable Haptics          [✓]         │
│                                       │
│  Feedback Intensity                  │
│  Light ━━━●━━━━━━ Heavy              │
│                                       │
│  Haptic Events:                      │
│  [✓] Scan success                    │
│  [✓] Scan error                      │
│  [✓] Button presses                  │
│  [✓] Task completion                 │
│  [ ] Every scan (battery drain)      │
└─────────────────────────────────────┘
```

### 5.5 NFC Integration (Optional)

**Use Cases:**
- Tap NFC tags on locations for quick navigation
- NFC-enabled ID badges for user verification
- Smart labels on products

**Technology Stack:**
- **react-native-nfc-manager**: NFC reading/writing

**Implementation:**

```typescript
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

async function readNfcTag() {
  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);

    const tag = await NfcManager.getTag();

    if (tag && tag.ndefMessage) {
      const payload = tag.ndefMessage[0].payload;
      const text = Ndef.text.decodePayload(payload);

      // Parse location code from NFC tag
      if (text.startsWith('LOC:')) {
        const locationCode = text.substring(4);
        navigateToLocation(locationCode);
      }
    }
  } catch (ex) {
    console.warn('NFC read failed', ex);
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
}

async function writeNfcTag(locationCode: string) {
  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);

    const bytes = Ndef.encodeMessage([
      Ndef.textRecord(`LOC:${locationCode}`)
    ]);

    await NfcManager.ndefHandler.writeNdefMessage(bytes);

    Alert.alert('Success', 'Location tag written successfully');
  } catch (ex) {
    Alert.alert('Error', 'Failed to write NFC tag');
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
}
```

---

## 6. Cross-Module Integration

### 6.1 Integration Patterns

**1. Deep Linking (Navigation)**

When one module needs to navigate to another:

```typescript
// From Inventory → Analytics
function viewInventoryAnalytics(productId: string) {
  const deepLink = `horizon://analytics/inventory?productId=${productId}`;
  Linking.openURL(deepLink);
}

// From Analytics → Inventory (stock alert)
function viewProduct(productId: string) {
  const deepLink = `horizon://inventory/product/${productId}`;
  Linking.openURL(deepLink);
}

// Deep link handler (App.tsx)
useEffect(() => {
  const handleDeepLink = (event: { url: string }) => {
    const { url } = event;
    const route = parseDeepLink(url);

    if (route) {
      navigation.navigate(route.screen, route.params);
    }
  };

  Linking.addEventListener('url', handleDeepLink);

  // Handle initial URL (app launched from link)
  Linking.getInitialURL().then(url => {
    if (url) handleDeepLink({ url });
  });

  return () => Linking.removeEventListener('url', handleDeepLink);
}, []);
```

**2. Event Bus (Module Communication)**

For real-time communication between modules:

```typescript
// Event bus (Redux middleware or EventEmitter)
import { EventEmitter } from 'events';

const moduleEventBus = new EventEmitter();

// Inventory module emits event when stock changes
function onStockAdjusted(productId: string, newQuantity: number) {
  moduleEventBus.emit('inventory:stock_adjusted', {
    productId,
    newQuantity,
    timestamp: Date.now(),
  });
}

// Analytics module listens for stock changes
moduleEventBus.on('inventory:stock_adjusted', (data) => {
  // Update analytics dashboard
  dispatch(updateInventoryMetric(data));
});

// Order module listens for stock changes (for availability)
moduleEventBus.on('inventory:stock_adjusted', (data) => {
  // Check if any pending orders can now be fulfilled
  dispatch(checkPendingOrders(data.productId));
});
```

**3. Shared Services (Common APIs)**

Services used across multiple modules:

```typescript
// User Service (shared)
export const UserService = {
  getCurrentUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  getUserPermissions: async (moduleId: string) => {
    const user = await UserService.getCurrentUser();
    const { data } = await supabase
      .from('user_permissions')
      .select('*')
      .eq('user_id', user.id)
      .eq('module_id', moduleId)
      .single();
    return data;
  },
};

// Analytics Service (shared)
export const AnalyticsService = {
  trackEvent: async (event: string, properties: any) => {
    await supabase.from('analytics_events').insert({
      event_name: event,
      properties,
      user_id: (await UserService.getCurrentUser()).id,
      timestamp: new Date().toISOString(),
    });
  },

  getModuleMetrics: async (moduleId: string, dateRange: DateRange) => {
    const { data } = await supabase
      .rpc('get_module_metrics', {
        module_id: moduleId,
        start_date: dateRange.start,
        end_date: dateRange.end,
      });
    return data;
  },
};

// Notification Service (shared)
export const NotificationService = {
  sendNotification: async (userId: string, notification: Notification) => {
    await supabase.from('notifications').insert({
      user_id: userId,
      ...notification,
    });
  },

  markAsRead: async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notificationId);
  },
};
```

**4. Module API (Typed Interfaces)**

Each module exposes a typed API for other modules:

```typescript
// Inventory Module API
export const InventoryModuleAPI = {
  // Check product availability
  checkAvailability: async (productId: string, quantity: number): Promise<boolean> => {
    const stock = await getStockLevel(productId);
    return stock.available >= quantity;
  },

  // Reserve stock for an order (called by Order module)
  reserveStock: async (productId: string, quantity: number, orderId: string): Promise<boolean> => {
    const result = await supabase.rpc('reserve_stock', {
      product_id: productId,
      quantity,
      order_id: orderId,
    });
    return result.success;
  },

  // Get product details
  getProduct: async (productId: string): Promise<Product> => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    return data;
  },

  // Get stock levels across all locations
  getStockLevels: async (productId: string): Promise<StockLevel[]> => {
    const { data } = await supabase
      .from('stock_levels')
      .select('*, location:locations(*)')
      .eq('product_id', productId);
    return data;
  },
};

// Other modules can import and use this API
import { InventoryModuleAPI } from '@/modules/inventory/api';

// In Order module:
async function createOrder(items: OrderItem[]) {
  // Check stock availability
  for (const item of items) {
    const available = await InventoryModuleAPI.checkAvailability(
      item.productId,
      item.quantity
    );

    if (!available) {
      throw new Error(`Insufficient stock for ${item.productName}`);
    }
  }

  // Reserve stock
  for (const item of items) {
    await InventoryModuleAPI.reserveStock(
      item.productId,
      item.quantity,
      orderId
    );
  }

  // Create order...
}
```

### 6.2 Example Cross-Module Flows

**Flow 1: Analytics → Inventory (Low Stock Alert)**

```
1. Analytics module monitors stock levels
2. Detects Widget ABC is below minimum threshold
3. Sends push notification: "Low Stock: Widget ABC"
4. User taps notification
5. Deep link opens Inventory module: horizon://inventory/product/123
6. Inventory module shows product detail with "Reorder" action
7. User taps "Reorder" → Opens purchasing module (if subscribed)
```

**Flow 2: Inventory → People (Assign Task)**

```
1. Warehouse manager creates cycle count task in Inventory module
2. Selects "Assign to User" → Opens People module user picker
3. Manager selects John Doe
4. Inventory module calls PeopleModuleAPI.assignTask()
5. John Doe receives notification: "New task assigned: Cycle Count Zone A"
6. John opens notification → Deep link to Inventory task detail
7. John completes task → Inventory module emits 'task_completed' event
8. People module listens and updates John's task completion metrics
```

**Flow 3: Order → Inventory → Logistics (Order Fulfillment)**

```
1. New order created in Order module
2. Order module calls InventoryModuleAPI.reserveStock()
3. Inventory reserves stock, creates picking task
4. Warehouse worker picks items in Inventory module
5. Worker completes picking → Inventory emits 'picking_completed' event
6. Logistics module listens, creates shipment
7. Order module updates order status to "Shipped"
8. Customer receives notification (from Order module)
```

### 6.3 Module Registry & Dynamic Loading

**Module Registry (Global State):**

```typescript
interface ModuleDefinition {
  id: string;
  name: string;
  icon: string;
  component: () => Promise<any>; // Lazy load
  initialRoute: string;
  api: any; // Module API
  eventHandlers: Record<string, Function>; // Event listeners
}

const MODULE_REGISTRY: Record<string, ModuleDefinition> = {
  inventory: {
    id: 'inventory',
    name: 'Inventory Management',
    icon: 'warehouse',
    component: () => import('@/modules/inventory'),
    initialRoute: 'InventoryDashboard',
    api: InventoryModuleAPI,
    eventHandlers: {
      'order:created': handleNewOrder,
      'product:updated': handleProductUpdate,
    },
  },
  analytics: {
    id: 'analytics',
    name: 'Analytics & Reporting',
    icon: 'bar-chart',
    component: () => import('@/modules/analytics'),
    initialRoute: 'AnalyticsDashboard',
    api: AnalyticsModuleAPI,
    eventHandlers: {
      'inventory:stock_adjusted': handleStockChange,
    },
  },
  // ... other modules
};
```

**Dynamic Module Loading:**

```typescript
function ModuleLoader({ moduleId }: { moduleId: string }) {
  const [moduleComponent, setModuleComponent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModule = async () => {
      const moduleDef = MODULE_REGISTRY[moduleId];

      if (!moduleDef) {
        console.error(`Module ${moduleId} not found`);
        return;
      }

      // Check subscription
      if (!hasModuleAccess(moduleId)) {
        setModuleComponent(() => UpgradeScreen);
        setLoading(false);
        return;
      }

      // Lazy load module
      const module = await moduleDef.component();
      setModuleComponent(() => module.default);
      setLoading(false);

      // Register event handlers
      Object.entries(moduleDef.eventHandlers).forEach(([event, handler]) => {
        moduleEventBus.on(event, handler);
      });

      // Track module access
      AnalyticsService.trackEvent('module_accessed', { moduleId });
    };

    loadModule();

    return () => {
      // Cleanup event handlers
      const moduleDef = MODULE_REGISTRY[moduleId];
      if (moduleDef) {
        Object.keys(moduleDef.eventHandlers).forEach(event => {
          moduleEventBus.removeAllListeners(event);
        });
      }
    };
  }, [moduleId]);

  if (loading) {
    return <ModuleLoadingScreen moduleName={MODULE_REGISTRY[moduleId]?.name} />;
  }

  const ModuleComponent = moduleComponent;
  return <ModuleComponent />;
}
```

---

## 7. State Management

### 7.1 Redux Architecture

**Store Structure:**

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import MMKVStorage from 'react-native-mmkv-storage';

const storage = new MMKVStorage.Loader()
  .withEncryption()
  .initialize();

// Root reducer
const rootReducer = combineReducers({
  // Global state (always loaded)
  app: appReducer,
  auth: authReducer,
  network: networkReducer,
  notifications: notificationsReducer,

  // Module states (lazy loaded)
  modules: modulesReducer,

  // Offline queue
  offline: offlineReducer,
});

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'offline'], // Only persist these
  blacklist: ['network'], // Don't persist network state
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(offlineMiddleware, analyticsMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 7.2 Global State (App-Wide)

**App Slice:**

```typescript
// store/slices/appSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface AppState {
  isInitialized: boolean;
  currentModule: string | null;
  moduleHistory: string[];
  settings: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    haptics: boolean;
  };
}

const initialState: AppState = {
  isInitialized: false,
  currentModule: null,
  moduleHistory: [],
  settings: {
    theme: 'system',
    language: 'en',
    haptics: true,
  },
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    initializeApp: (state) => {
      state.isInitialized = true;
    },
    setCurrentModule: (state, action) => {
      if (state.currentModule) {
        state.moduleHistory.push(state.currentModule);
      }
      state.currentModule = action.payload;
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
});

export const { initializeApp, setCurrentModule, updateSettings } = appSlice.actions;
export default appSlice.reducer;
```

**Auth Slice:**

```typescript
// store/slices/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  organization: Organization | null;
  subscriptions: ModuleSubscription[];
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  session: null,
  organization: null,
  subscriptions: [],
  loading: false,
  error: null,
};

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Fetch organization and subscriptions
    const { data: orgData } = await supabase
      .from('organizations')
      .select('*, subscriptions(*)')
      .eq('id', data.user.user_metadata.organization_id)
      .single();

    return {
      user: data.user,
      session: data.session,
      organization: orgData,
      subscriptions: orgData.subscriptions,
    };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null;
      state.session = null;
      state.organization = null;
      state.subscriptions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.organization = action.payload.organization;
        state.subscriptions = action.payload.subscriptions;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { signOut } = authSlice.actions;
export default authSlice.reducer;
```

**Network Slice:**

```typescript
// store/slices/networkSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import NetInfo from '@react-native-community/netinfo';

interface NetworkState {
  isOnline: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
  lastSyncedAt: number | null;
  syncInProgress: boolean;
}

const initialState: NetworkState = {
  isOnline: true,
  isInternetReachable: null,
  type: null,
  lastSyncedAt: null,
  syncInProgress: false,
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    updateNetworkStatus: (state, action) => {
      state.isOnline = action.payload.isConnected;
      state.isInternetReachable = action.payload.isInternetReachable;
      state.type = action.payload.type;
    },
    setSyncInProgress: (state, action) => {
      state.syncInProgress = action.payload;
    },
    updateLastSyncedAt: (state) => {
      state.lastSyncedAt = Date.now();
    },
  },
});

export const { updateNetworkStatus, setSyncInProgress, updateLastSyncedAt } = networkSlice.actions;
export default networkSlice.reducer;

// Network monitoring
export function setupNetworkMonitoring(dispatch: AppDispatch) {
  NetInfo.addEventListener(state => {
    dispatch(updateNetworkStatus(state));

    // Trigger sync when coming online
    if (state.isConnected && state.isInternetReachable) {
      dispatch(performSync());
    }
  });
}
```

### 7.3 Module State (Inventory)

**Inventory Slice:**

```typescript
// modules/inventory/store/inventorySlice.ts
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';

// Entity adapters for normalized state
const productsAdapter = createEntityAdapter<Product>();
const locationsAdapter = createEntityAdapter<Location>();
const transactionsAdapter = createEntityAdapter<Transaction>();

interface InventoryState {
  products: ReturnType<typeof productsAdapter.getInitialState>;
  locations: ReturnType<typeof locationsAdapter.getInitialState>;
  transactions: ReturnType<typeof transactionsAdapter.getInitialState>;
  scanner: {
    mode: 'idle' | 'scanning' | 'processing';
    context: 'lookup' | 'receiving' | 'picking' | 'counting';
    lastScanned: string | null;
    scanHistory: string[];
  };
  cache: {
    lastUpdated: Record<string, number>;
  };
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  products: productsAdapter.getInitialState(),
  locations: locationsAdapter.getInitialState(),
  transactions: transactionsAdapter.getInitialState(),
  scanner: {
    mode: 'idle',
    context: 'lookup',
    lastScanned: null,
    scanHistory: [],
  },
  cache: {
    lastUpdated: {},
  },
  loading: false,
  error: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'inventory/fetchProducts',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const lastSynced = state.inventory.cache.lastUpdated.products || 0;

    // Delta sync
    const { data } = await supabase
      .from('products')
      .select('*')
      .gt('updated_at', new Date(lastSynced).toISOString());

    return data;
  }
);

export const scanBarcode = createAsyncThunk(
  'inventory/scanBarcode',
  async (barcode: string, { getState, dispatch }) => {
    // Check local database first (offline support)
    const product = await findProductByBarcode(barcode);

    if (!product) {
      throw new Error('Product not found');
    }

    // Add to offline queue if offline
    const isOnline = (getState() as RootState).network.isOnline;
    if (!isOnline) {
      dispatch(addToOfflineQueue({
        action: 'scan',
        payload: { barcode, productId: product.id, timestamp: Date.now() },
      }));
    }

    return product;
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setScannerMode: (state, action) => {
      state.scanner.mode = action.payload;
    },
    setScannerContext: (state, action) => {
      state.scanner.context = action.payload;
    },
    addToScanHistory: (state, action) => {
      state.scanner.scanHistory.unshift(action.payload);
      state.scanner.scanHistory = state.scanner.scanHistory.slice(0, 10); // Keep last 10
    },
    clearScanHistory: (state) => {
      state.scanner.scanHistory = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        productsAdapter.upsertMany(state.products, action.payload);
        state.cache.lastUpdated.products = Date.now();
      })
      .addCase(scanBarcode.fulfilled, (state, action) => {
        state.scanner.lastScanned = action.payload.id;
        state.scanner.mode = 'idle';
      })
      .addCase(scanBarcode.rejected, (state, action) => {
        state.error = action.error.message;
        state.scanner.mode = 'idle';
      });
  },
});

export const { setScannerMode, setScannerContext, addToScanHistory, clearScanHistory } = inventorySlice.actions;
export default inventorySlice.reducer;

// Selectors
export const {
  selectAll: selectAllProducts,
  selectById: selectProductById,
} = productsAdapter.getSelectors((state: RootState) => state.inventory.products);
```

### 7.4 Offline Queue State

**Offline Slice:**

```typescript
// store/slices/offlineSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface OfflineState {
  queue: OfflineQueueItem[];
  syncStatus: 'idle' | 'syncing' | 'error';
  lastError: string | null;
}

const initialState: OfflineState = {
  queue: [],
  syncStatus: 'idle',
  lastError: null,
};

export const addToOfflineQueue = createAsyncThunk(
  'offline/addToQueue',
  async (item: Omit<OfflineQueueItem, 'id' | 'timestamp' | 'status'>) => {
    const queueItem: OfflineQueueItem = {
      ...item,
      id: generateUUID(),
      timestamp: Date.now(),
      status: 'pending',
      retryCount: 0,
      maxRetries: 3,
    };

    // Save to SQLite
    await saveToOfflineQueue(queueItem);

    return queueItem;
  }
);

export const processOfflineQueue = createAsyncThunk(
  'offline/processQueue',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const queue = state.offline.queue.filter(item => item.status === 'pending');

    for (const item of queue) {
      try {
        await executeSyncOperation(item);
        dispatch(markQueueItemCompleted(item.id));
      } catch (error) {
        dispatch(markQueueItemFailed({ id: item.id, error: error.message }));
      }
    }
  }
);

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    markQueueItemCompleted: (state, action) => {
      const item = state.queue.find(i => i.id === action.payload);
      if (item) {
        item.status = 'completed';
      }
    },
    markQueueItemFailed: (state, action) => {
      const item = state.queue.find(i => i.id === action.payload.id);
      if (item) {
        item.status = 'failed';
        item.errorMessage = action.payload.error;
      }
    },
    removeCompletedItems: (state) => {
      state.queue = state.queue.filter(item => item.status !== 'completed');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToOfflineQueue.fulfilled, (state, action) => {
        state.queue.push(action.payload);
      })
      .addCase(processOfflineQueue.pending, (state) => {
        state.syncStatus = 'syncing';
      })
      .addCase(processOfflineQueue.fulfilled, (state) => {
        state.syncStatus = 'idle';
      })
      .addCase(processOfflineQueue.rejected, (state, action) => {
        state.syncStatus = 'error';
        state.lastError = action.error.message;
      });
  },
});

export const { markQueueItemCompleted, markQueueItemFailed, removeCompletedItems } = offlineSlice.actions;
export default offlineSlice.reducer;
```

### 7.5 Middleware

**Offline Middleware:**

```typescript
// store/middleware/offlineMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';

export const offlineMiddleware: Middleware = store => next => action => {
  const result = next(action);

  // Intercept actions that modify data
  if (action.type.includes('inventory/') &&
      (action.type.includes('adjust') ||
       action.type.includes('transfer') ||
       action.type.includes('scan'))) {

    const state = store.getState();

    // If offline, add to queue
    if (!state.network.isOnline) {
      store.dispatch(addToOfflineQueue({
        moduleId: 'inventory',
        action: action.type,
        payload: action.payload,
      }));
    }
  }

  return result;
};
```

**Analytics Middleware:**

```typescript
// store/middleware/analyticsMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { AnalyticsService } from '@/services/analytics';

export const analyticsMiddleware: Middleware = store => next => action => {
  const result = next(action);

  // Track specific actions
  if (action.type.includes('scan') ||
      action.type.includes('adjust') ||
      action.type.includes('transfer')) {

    AnalyticsService.trackEvent(action.type, {
      timestamp: Date.now(),
      module: action.type.split('/')[0],
      userId: store.getState().auth.user?.id,
    });
  }

  return result;
};
```

---

## 8. Performance Optimization

### 8.1 Module Lazy Loading

**Dynamic Import Strategy:**

```typescript
// App.tsx
import React, { Suspense } from 'react';

// Lazy load modules
const InventoryModule = React.lazy(() => import('@/modules/inventory'));
const AnalyticsModule = React.lazy(() => import('@/modules/analytics'));
const PeopleModule = React.lazy(() => import('@/modules/people'));

function ModuleScreen({ route }) {
  const { moduleId } = route.params;

  let ModuleComponent;
  switch (moduleId) {
    case 'inventory':
      ModuleComponent = InventoryModule;
      break;
    case 'analytics':
      ModuleComponent = AnalyticsModule;
      break;
    case 'people':
      ModuleComponent = PeopleModule;
      break;
    default:
      return <NotFoundScreen />;
  }

  return (
    <Suspense fallback={<ModuleLoadingScreen moduleName={moduleId} />}>
      <ModuleComponent />
    </Suspense>
  );
}
```

**Preload Next Likely Module:**

```typescript
// Preload based on user behavior
useEffect(() => {
  const currentModule = route.params.moduleId;

  // Analytics: Most users go to inventory after analytics
  if (currentModule === 'analytics') {
    InventoryModule.preload();
  }

  // Inventory: Most users check analytics after inventory operations
  if (currentModule === 'inventory') {
    AnalyticsModule.preload();
  }
}, [route.params.moduleId]);
```

**Module Bundle Size Targets:**
- App Shell: < 1 MB (compressed)
- Each Module: < 500 KB (compressed)
- Total Initial Download: < 2 MB
- Subsequent Module Load: < 300ms

### 8.2 Image Optimization

**Progressive Loading:**

```typescript
import FastImage from 'react-native-fast-image';

function ProductImage({ product }) {
  return (
    <FastImage
      style={styles.image}
      source={{
        uri: product.imageUrl,
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.immutable,
      }}
      resizeMode={FastImage.resizeMode.cover}
      fallback
    />
  );
}
```

**Image Caching Strategy:**
- Cache product images for 7 days
- Thumbnails: 200x200 (for lists)
- Detail views: 800x800 (for product detail)
- Use WebP format (if supported)
- Lazy load images below fold

**Image Upload Optimization:**

```typescript
import ImageResizer from 'react-native-image-resizer';

async function uploadProductImage(imageUri: string) {
  // Resize before upload
  const resized = await ImageResizer.createResizedImage(
    imageUri,
    1920,
    1920,
    'JPEG',
    80, // quality
    0, // rotation
    null,
    false,
    { mode: 'contain', onlyScaleDown: true }
  );

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(`${Date.now()}.jpg`, {
      uri: resized.uri,
      type: 'image/jpeg',
      name: `${Date.now()}.jpg`,
    });

  return data?.path;
}
```

### 8.3 Data Pagination

**Virtual Lists:**

```typescript
import { FlashList } from '@shopify/flash-list';

function ProductList({ products }) {
  const renderItem = useCallback(({ item }) => (
    <ProductListItem product={item} />
  ), []);

  return (
    <FlashList
      data={products}
      renderItem={renderItem}
      estimatedItemSize={80}
      keyExtractor={item => item.id}
      // Optimization props
      removeClippedSubviews
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={5}
    />
  );
}
```

**Infinite Scroll:**

```typescript
function ProductBrowser() {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const pageSize = 50;
    const { data } = await supabase
      .from('products')
      .select('*')
      .range((page - 1) * pageSize, page * pageSize - 1);

    setProducts(prev => [...prev, ...data]);
    setHasMore(data.length === pageSize);
    setPage(prev => prev + 1);
    setLoading(false);
  };

  return (
    <FlashList
      data={products}
      renderItem={renderItem}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <LoadingSpinner /> : null}
    />
  );
}
```

### 8.4 Background Sync Optimization

**Work Manager (Android) / Background Fetch (iOS):**

```typescript
import BackgroundFetch from 'react-native-background-fetch';

async function setupBackgroundSync() {
  BackgroundFetch.configure({
    minimumFetchInterval: 15, // 15 minutes
    stopOnTerminate: false,
    startOnBoot: true,
    enableHeadless: true,
    requiresBatteryNotLow: true,
    requiresCharging: false,
    requiresDeviceIdle: false,
    requiresStorageNotLow: false,
  }, async (taskId) => {
    console.log('[BackgroundFetch] Task started:', taskId);

    // Perform sync
    await performSync();

    // Finish task
    BackgroundFetch.finish(taskId);
  }, (taskId) => {
    console.log('[BackgroundFetch] Task timeout:', taskId);
    BackgroundFetch.finish(taskId);
  });

  BackgroundFetch.status((status) => {
    console.log('[BackgroundFetch] Status:', status);
  });
}
```

**Batch Operations:**

```typescript
// Instead of syncing each item individually, batch them
async function syncBatch(items: SyncItem[]) {
  const batches = chunk(items, 50); // 50 items per batch

  for (const batch of batches) {
    await supabase.rpc('sync_batch', { items: batch });
  }
}
```

**Differential Sync:**

```typescript
async function syncProducts() {
  const lastSynced = await getLastSyncTimestamp('products');

  // Only fetch changes since last sync
  const { data } = await supabase
    .from('products')
    .select('*')
    .gt('updated_at', new Date(lastSynced).toISOString());

  // Update local database
  await updateLocalProducts(data);

  // Update sync timestamp
  await setLastSyncTimestamp('products', Date.now());
}
```

### 8.5 Memory Management

**Clear Module State on Exit:**

```typescript
useEffect(() => {
  return () => {
    // Cleanup when leaving module
    dispatch(clearInventoryCache());
    dispatch(clearScanHistory());
  };
}, []);
```

**Unmount Camera:**

```typescript
function ScannerScreen() {
  const [isCameraActive, setIsCameraActive] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setIsCameraActive(true);

      return () => {
        // Unmount camera when screen loses focus
        setIsCameraActive(false);
      };
    }, [])
  );

  return isCameraActive ? <Camera /> : <View />;
}
```

**Limit Transaction History:**

```typescript
// Keep only last 30 days in local database
async function pruneOldTransactions() {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  await db.executeSql(
    'DELETE FROM transactions WHERE created_at < ?',
    [thirtyDaysAgo]
  );

  // Vacuum database to reclaim space
  await db.executeSql('VACUUM');
}
```

---

## 9. Testing Strategy

### 9.1 Component Testing

**Jest + React Native Testing Library:**

```typescript
// __tests__/ProductListItem.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import ProductListItem from '@/components/ProductListItem';

describe('ProductListItem', () => {
  const mockProduct = {
    id: '1',
    name: 'Widget ABC',
    sku: 'WDG-001',
    stock: 45,
    minStock: 50,
  };

  it('renders product information correctly', () => {
    const { getByText } = render(<ProductListItem product={mockProduct} />);

    expect(getByText('Widget ABC')).toBeTruthy();
    expect(getByText('SKU: WDG-001')).toBeTruthy();
    expect(getByText('45 units')).toBeTruthy();
  });

  it('shows low stock warning', () => {
    const { getByText } = render(<ProductListItem product={mockProduct} />);

    expect(getByText(/Low/i)).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <ProductListItem product={mockProduct} onPress={onPress} />
    );

    fireEvent.press(getByTestId('product-item'));
    expect(onPress).toHaveBeenCalledWith(mockProduct);
  });
});
```

**Mock Camera:**

```typescript
// __mocks__/react-native-vision-camera.ts
export const useCameraDevice = jest.fn(() => ({
  id: 'mock-device',
  name: 'Mock Camera',
}));

export const useCodeScanner = jest.fn((config) => {
  // Simulate barcode scan
  setTimeout(() => {
    config.onCodeScanned([{ value: '1234567890', type: 'ean-13' }]);
  }, 100);

  return {};
});

export const Camera = jest.fn(({ children }) => children);
```

### 9.2 Integration Testing

**Detox (E2E):**

```typescript
// e2e/inventory.e2e.ts
describe('Inventory Module', () => {
  beforeAll(async () => {
    await device.launchApp();
    await device.reloadReactNative();
  });

  it('should login and navigate to inventory module', async () => {
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();

    await waitFor(element(by.id('modules-tab')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('modules-tab')).tap();
    await element(by.id('inventory-module')).tap();

    await expect(element(by.text('Inventory Management'))).toBeVisible();
  });

  it('should scan a barcode and view product', async () => {
    await element(by.id('scan-button')).tap();

    // Simulate barcode scan (Detox can't actually scan)
    // In real test, use test device with mock barcode images
    await element(by.id('manual-entry')).tap();
    await element(by.id('barcode-input')).typeText('1234567890\n');

    await waitFor(element(by.id('product-detail')))
      .toBeVisible()
      .withTimeout(3000);

    await expect(element(by.text('Widget ABC'))).toBeVisible();
  });

  it('should adjust stock quantity', async () => {
    await element(by.id('adjust-stock-button')).tap();
    await element(by.id('quantity-input')).typeText('10');
    await element(by.id('reason-picker')).tap();
    await element(by.text('Damaged')).tap();
    await element(by.id('confirm-button')).tap();

    await expect(element(by.text('Stock adjusted successfully'))).toBeVisible();
  });
});
```

### 9.3 Offline Scenario Testing

**Network Mocking:**

```typescript
// __tests__/offline.test.tsx
import NetInfo from '@react-native-community/netinfo';
import { performSync, addToOfflineQueue } from '@/store/slices/offlineSlice';

jest.mock('@react-native-community/netinfo');

describe('Offline Operations', () => {
  it('should queue actions when offline', async () => {
    // Mock offline state
    NetInfo.fetch.mockResolvedValue({
      isConnected: false,
      isInternetReachable: false,
    });

    const dispatch = jest.fn();
    const getState = jest.fn(() => ({
      network: { isOnline: false },
    }));

    await addToOfflineQueue({
      action: 'scan',
      payload: { barcode: '123' },
    })(dispatch, getState, null);

    expect(dispatch).toHaveBeenCalled();
  });

  it('should sync queue when coming online', async () => {
    // Mock online state
    NetInfo.fetch.mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
    });

    const dispatch = jest.fn();
    const getState = jest.fn(() => ({
      network: { isOnline: true },
      offline: {
        queue: [{ id: '1', status: 'pending' }],
      },
    }));

    await performSync()(dispatch, getState, null);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'offline/processQueue/pending' })
    );
  });
});
```

**Real Device Testing:**

1. Turn on airplane mode
2. Perform inventory operations (scan, adjust, transfer)
3. Verify actions are queued
4. Turn off airplane mode
5. Verify queue processes and syncs to server
6. Check for conflicts and resolution

### 9.4 Barcode Scanning Testing

**Test Dataset:**

Create a set of test barcodes (printed or displayed on screen):
- Valid product barcodes (in test database)
- Invalid barcodes (not in database)
- Multiple formats (UPC, EAN, Code 128, QR)
- Damaged/unclear barcodes (test error handling)

**Performance Testing:**

```typescript
// Measure scan-to-action latency
it('should scan barcode in less than 200ms', async () => {
  const startTime = Date.now();

  await scanBarcode('1234567890');

  const endTime = Date.now();
  const latency = endTime - startTime;

  expect(latency).toBeLessThan(200);
});
```

**Continuous Scan Testing:**

```typescript
it('should handle rapid consecutive scans', async () => {
  const barcodes = ['123', '456', '789', '012', '345'];

  for (const barcode of barcodes) {
    await scanBarcode(barcode);
    await new Promise(resolve => setTimeout(resolve, 100)); // 100ms between scans
  }

  const scanHistory = getScanHistory();
  expect(scanHistory.length).toBe(5);
  expect(scanHistory).toEqual(barcodes.reverse()); // Most recent first
});
```

### 9.5 Performance Testing

**React Native Performance Monitor:**

```typescript
import { PerformanceObserver, performance } from 'react-native-performance';

const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`);
  });
});

observer.observe({ entryTypes: ['measure'] });

// Measure specific operations
performance.mark('scan-start');
await scanBarcode('123');
performance.mark('scan-end');
performance.measure('scan-operation', 'scan-start', 'scan-end');
```

**Metrics to Track:**
- App launch time (cold start < 3 seconds)
- Module load time (< 1 second)
- Screen transition time (< 300ms)
- Scan latency (< 200ms)
- Sync duration (depends on queue size)
- Memory usage (< 200MB for inventory module)
- Battery drain (< 5% per hour of active use)

**Flipper Integration:**

Use Flipper for:
- Network inspection
- Redux state debugging
- Performance profiling
- Database inspection (SQLite)
- Crash reporting

---

## 10. Technology Stack Summary

### 10.1 Core Technologies

**Framework:**
- React Native 0.73+ (CLI or Expo Bare Workflow)
- TypeScript 5.x
- Node.js 18+ (for build tools)

**State Management:**
- Redux Toolkit 2.x
- RTK Query (API caching)
- Redux Persist (offline storage)
- Redux Offline middleware

**Navigation:**
- React Navigation 6.x
- Bottom Tabs Navigator
- Stack Navigator
- Deep Linking support

**Database:**
- @op-engineering/op-sqlite (fastest SQLite)
- OR WatermelonDB (reactive database)
- SQLCipher (encryption)
- react-native-mmkv (key-value storage)

**Backend:**
- Supabase (database, auth, storage, realtime)
- PostgreSQL with Row Level Security
- Supabase Storage (for images, documents)

### 10.2 Native Modules

**Camera & Scanning:**
- react-native-vision-camera
- vision-camera-code-scanner
- react-native-image-picker

**Bluetooth:**
- react-native-ble-plx

**Location:**
- @react-native-community/geolocation
- react-native-geolocation-service
- react-native-background-geolocation

**Notifications:**
- @react-native-firebase/messaging
- OR notifee (local notifications)

**Haptics:**
- react-native-haptic-feedback

**NFC (Optional):**
- react-native-nfc-manager

### 10.3 UI & Performance

**UI Components:**
- React Native Paper (or NativeBase)
- react-native-reanimated (animations)
- react-native-gesture-handler (touch)
- react-native-svg (icons)

**Performance:**
- @shopify/flash-list (high-performance lists)
- react-native-fast-image (image caching)
- react-native-background-fetch (background sync)

**Developer Tools:**
- Flipper (debugging)
- Reactotron (Redux debugging)
- Sentry (error tracking)
- CodePush (OTA updates)

**Testing:**
- Jest (unit tests)
- React Native Testing Library (component tests)
- Detox (E2E tests)
- Maestro (alternative E2E)

---

## 11. Security & Compliance

**Authentication:**
- JWT tokens (1 hour expiry)
- Refresh tokens (30 days)
- Biometric authentication
- Supabase Row Level Security

**Data Encryption:**
- SQLCipher for database encryption
- HTTPS/TLS for all API calls
- Certificate pinning
- Secure storage (Keychain/Keystore)

**Privacy:**
- GDPR/POPIA compliance
- Data minimization
- User consent for permissions
- Data export/deletion capabilities

**Audit Logging:**
- All inventory changes logged
- User actions tracked
- Authentication events monitored
- Secure log storage

---

## 12. Deployment & Operations

**Build Variants:**
- Development (dev Supabase)
- Staging (staging environment)
- Production (prod Supabase)

**App Stores:**
- iOS: TestFlight → App Store (phased rollout)
- Android: Internal Testing → Production (staged rollout)

**Over-The-Air Updates:**
- CodePush for JavaScript updates
- Rollback capability
- A/B testing support

**CI/CD:**
- GitHub Actions pipeline
- Automated testing
- Build automation
- Deployment approval gates

**Monitoring:**
- Sentry (crash reporting)
- Mixpanel/Amplitude (analytics)
- New Relic (performance)
- Custom metrics dashboard

---

## 13. Future Enhancements

**Short Term (3-6 months):**
- Voice commands for hands-free operation
- AR warehouse navigation
- Wearable device support (Apple Watch, Wear OS)
- Offline-capable barcode printing

**Medium Term (6-12 months):**
- RFID support (for high-volume operations)
- AI-powered inventory forecasting
- Automated reordering
- Advanced analytics dashboards

**Long Term (12+ months):**
- Tablet optimization (split view, drag-drop)
- Computer vision for product recognition
- IoT sensor integration (temp, humidity)
- Blockchain-based audit trail (for regulated industries)

---

## Document Version

- **Version:** 1.0
- **Last Updated:** 2025-01-15
- **Author:** Claude Code (Anthropic)
- **Status:** Final

---

## Related Documents

- `01-ARCHITECTURE.md` - Overall platform architecture
- `02-DATABASE-SCHEMA.md` - Database design
- `03-API-SPEC.md` - API specifications
- `MOBILE_STRATEGY.md` - Web app mobile strategy
- `SUPABASE_AUTH_SETUP.md` - Backend authentication

---

**End of Document**
