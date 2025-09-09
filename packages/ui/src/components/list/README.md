# List Component System

A comprehensive, flexible, and feature-rich list component system for OwnFit applications. Built with TypeScript, accessibility in mind, and designed for maximum reusability across different use cases.

## 🚀 Features

- 🏗️ **Modular Architecture**: Composable components for maximum flexibility
- 📱 **Responsive Design**: Works seamlessly across all screen sizes
- ♿ **Accessibility First**: Full ARIA support, keyboard navigation, screen reader friendly
- 🎨 **Highly Customizable**: Extensive theming and styling options
- 🔍 **Built-in Search**: Debounced search with filtering capabilities
- 📄 **Pagination Support**: Cursor-based and offset pagination
- ✅ **Selection Management**: Single and multi-select with context
- 🔄 **State Management**: Loading, empty, and error states
- 🎭 **Multiple Variants**: List and gallery layouts
- 📊 **Data Integration**: Works with any data source
- 🎯 **Type Safe**: Full TypeScript support throughout
- 🚀 **Performance Optimized**: Virtualization-ready, minimal re-renders
- 🔧 **Developer Experience**: Rich debugging and development tools

## 📦 Components Overview

### Core Components

| Component        | Purpose          | Key Features                                  |
| ---------------- | ---------------- | --------------------------------------------- |
| `List.Container` | Main wrapper     | Search, pagination, layouts, state management |
| `List.Item`      | Individual items | Selection, actions, content organization      |
| `List.Loading`   | Loading states   | Skeleton screens, customizable count          |
| `List.Empty`     | Empty states     | Custom messages, actions, illustrations       |

### Content Components

| Component          | Purpose           | Usage                                 |
| ------------------ | ----------------- | ------------------------------------- |
| `List.Title`       | Item titles       | Primary text content                  |
| `List.Description` | Item descriptions | Secondary text, supports rich content |
| `List.Avatar`      | User avatars      | Profile images with fallbacks         |
| `List.Icon`        | General icons     | Visual indicators, status icons       |
| `List.Badge`       | Status indicators | Labels, tags, status badges           |
| `List.Badges`      | Badge collections | Multiple badges with layout options   |
| `List.Notes`       | Additional info   | Expandable notes with icons           |

### Action Components

| Component       | Purpose            | Features                          |
| --------------- | ------------------ | --------------------------------- |
| `List.Action`   | Individual actions | Icons, labels, click handlers     |
| `List.Actions`  | Action groups      | Multiple actions with positioning |
| `List.Dropdown` | Expandable content | Accordion-style with actions      |

### Advanced Components

| Component        | Purpose           | Capabilities                             |
| ---------------- | ----------------- | ---------------------------------------- |
| `DataList`       | Data-driven lists | Automatic rendering from data arrays     |
| `ListFilters`    | Filtering system  | Form-based filtering with multiple types |
| `ListPagination` | Navigation        | Page-based and cursor-based pagination   |

## 🎯 Quick Start

### Basic List

```tsx
import List from "@acme/ui-web/base/list";

function BasicList() {
  return (
    <List.Container>
      <List.Item>
        <List.Avatar src="/avatar1.jpg" firstName="John" lastName="Doe" />
        <List.Title>John Doe</List.Title>
        <List.Description>Software Engineer</List.Description>
        <List.Badge text="Active" color="success" />
      </List.Item>

      <List.Item>
        <List.Icon>
          <UserIcon />
        </List.Icon>
        <List.Title>Jane Smith</List.Title>
        <List.Description>Product Manager</List.Description>
        <List.Actions>
          <List.Action
            icon={<EditIcon />}
            label="Edit"
            onClick={() => console.log("Edit")}
          />
        </List.Actions>
      </List.Item>
    </List.Container>
  );
}
```

### Data-Driven List

```tsx
import { DataList } from "@acme/ui-web/base/list";

function UsersList({ users }) {
  return (
    <DataList
      data={users}
      getItemId={(user) => user.id}
      getItemTitle={(user) => user.name}
      getItemDescription={(user) => user.role}
      renderItemIcon={(user) => (
        <List.Avatar
          src={user.avatar}
          firstName={user.firstName}
          lastName={user.lastName}
        />
      )}
      renderItemBadge={(user) => (
        <List.Badge
          text={user.status}
          color={user.isActive ? "success" : "warning"}
        />
      )}
      onItemClick={(id) => navigate(`/users/${id}`)}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />
  );
}
```

### With Search and Filtering

```tsx
function FilterableList() {
  const { form, FiltersComponent } = useListFilters(filters, {
    defaultValues: { status: "active", role: null },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const filterValues = form.watch();

  return (
    <div>
      <FiltersComponent className="mb-4" />

      <List.Container
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        hideFilter={false}
        placeholder="Search users..."
      >
        {filteredUsers.map((user) => (
          <List.Item key={user.id}>
            <List.Title>{user.name}</List.Title>
            <List.Description>{user.email}</List.Description>
          </List.Item>
        ))}
      </List.Container>
    </div>
  );
}
```

## 🏗️ Component Architecture

### List.Container

The main wrapper that provides layout, search, pagination, and state management.

```tsx
<List.Container
  // Layout
  variant="list" | "gallery"
  squared={true}
  compact={false}
  maxHeight="400px"
  fitContent={false}
  flexFit={false}

  // Search
  hideFilter={false}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  placeholder="Search..."
  SearchComponent={CustomSearchComponent}

  // Selection
  isSelectionMode={false}
  onSelectedElementsChange={handleSelection}
  initialSelectedKeys={[]}
  selectAllByDefault={false}

  // State
  isLoading={false}
  isEmpty={false}
  loadingComponent={<CustomLoading />}
  emptyComponent={<CustomEmpty />}
  InfoScreenProps={{
    headline: "No items found",
    description: "Try adjusting your search",
    icon: SearchIcon
  }}
>
  {children}
</List.Container>
```

### List.Item

Individual list items with support for selection, actions, and rich content.

```tsx
<List.Item
  // Identity
  ListItemKey="unique-id"
  selected={false}
  // Content
  Title="Item Title"
  Description="Item description"
  LeftIcon={<Icon />}
  Badge={<List.Badge text="Status" />}
  Notes="Additional notes"
  Subnotes="Secondary notes"
  // Behavior
  onClick={handleClick}
  compact={false}
  inlineDescription={true}
  isRead={true}
  // Actions
  Actions={<List.Actions>...</List.Actions>}
  // Styling
  className="custom-class"
  contentClassName="content-class"
  titleClassName="title-class"
>
  {/* Component-based content */}
  <List.Avatar src="/avatar.jpg" />
  <List.Title>Dynamic Title</List.Title>
  <List.Description>Dynamic Description</List.Description>
  <List.Badges>
    <List.Badge text="Tag 1" />
    <List.Badge text="Tag 2" />
  </List.Badges>
  <List.Actions>
    <List.Action icon={<Edit />} label="Edit" />
    <List.Action icon={<Delete />} label="Delete" />
  </List.Actions>
</List.Item>
```

## 🎨 Layout Variants

### List Layout (Default)

```tsx
<List.Container variant="list">
  {/* Vertical list with dividers */}
</List.Container>
```

### Gallery Layout

```tsx
<List.Container variant="gallery">
  {/* Responsive grid layout */}
</List.Container>
```

### Compact Mode

```tsx
<List.Container compact={true}>
  {/* Single-line items with minimal spacing */}
</List.Container>
```

## 🔍 Search and Filtering

### Built-in Search

```tsx
<List.Container
  hideFilter={false}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  placeholder="Search items..."
/>
```

### Advanced Filtering

```tsx
import { useListFilters } from "@acme/ui-web/base/list/list-filters";

function FilteredList() {
  const filters = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
    {
      key: "dateRange",
      label: "Date Range",
      type: "range",
    },
  ];

  const { form, FiltersComponent, resetFilters } = useListFilters(filters);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Users</h2>
        <Button onClick={resetFilters}>Reset Filters</Button>
      </div>

      <FiltersComponent className="mb-4" />

      <List.Container>{/* Filtered content */}</List.Container>
    </div>
  );
}
```

## ✅ Selection Management

### Single Selection

```tsx
function SingleSelectionList() {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <List.Container>
      {items.map((item) => (
        <List.Item
          key={item.id}
          ListItemKey={item.id}
          selected={selectedId === item.id}
          onClick={() => setSelectedId(item.id)}
        >
          <List.Title>{item.title}</List.Title>
        </List.Item>
      ))}
    </List.Container>
  );
}
```

### Multi Selection with Context

```tsx
function MultiSelectionList() {
  return (
    <List.Container
      isSelectionMode={true}
      onSelectedElementsChange={(selected) => console.log(selected)}
      selectAllByDefault={false}
    >
      {items.map((item) => (
        <List.Item key={item.id} ListItemKey={item.id}>
          <List.Title>{item.title}</List.Title>
        </List.Item>
      ))}
    </List.Container>
  );
}
```

### Selection Actions

```tsx
function SelectionWithActions() {
  const [selectedItems, setSelectedItems] = useState([]);

  return (
    <List.Container
      isSelectionMode={true}
      onSelectedElementsChange={setSelectedItems}
      selectionActions={
        <div className="flex gap-2">
          <Button
            variant="destructive"
            disabled={selectedItems.length === 0}
            onClick={() => deleteItems(selectedItems)}
          >
            Delete Selected ({selectedItems.length})
          </Button>
          <Button
            disabled={selectedItems.length === 0}
            onClick={() => exportItems(selectedItems)}
          >
            Export Selected
          </Button>
        </div>
      }
    >
      {/* Items */}
    </List.Container>
  );
}
```

## 📄 Pagination

### Cursor-based Pagination

```tsx
import { usePagination } from "@acme/ui-web/base/list";

function PaginatedList() {
  const {
    currentPage,
    paginationParams,
    goToNextPage,
    goToPreviousPage,
    Pagination,
  } = usePagination({ limit: 10 });

  const { data, isLoading } = useQuery(["items", paginationParams], () =>
    fetchItems(paginationParams)
  );

  return (
    <div>
      <List.Container isLoading={isLoading}>
        {data?.items.map((item) => (
          <List.Item key={item.id}>
            <List.Title>{item.title}</List.Title>
          </List.Item>
        ))}
      </List.Container>

      <Pagination
        hasNextPage={data?.hasNextPage}
        hasPreviousPage={currentPage > 1}
        totalItems={data?.totalCount}
      />
    </div>
  );
}
```

## 🎭 Content Components

### Avatars and Icons

```tsx
// User Avatar
<List.Avatar
  src="/avatar.jpg"
  firstName="John"
  lastName="Doe"
  className="h-12 w-12"
/>

// Icon with click handler
<List.Icon onClick={handleIconClick}>
  <StarIcon className="text-yellow-500" />
</List.Icon>
```

### Badges and Status

```tsx
// Single Badge
<List.Badge
  text="Premium"
  color="success"
  size="sm"
  icon={<CrownIcon />}
/>

// Multiple Badges
<List.Badges spacing="normal" align="start" wrap={true}>
  <List.Badge text="React" color="info" />
  <List.Badge text="TypeScript" color="primary" />
  <List.Badge text="Next.js" color="secondary" />
</List.Badges>
```

### Rich Content

```tsx
// Rich Text Description
<List.Description>
  {/* Supports HTML/Markdown content */}
  <strong>Project Status:</strong> In progress with <em>3 tasks</em> remaining
</List.Description>

// Notes with Icons
<List.Notes>
  <div className="flex items-start gap-2">
    <InfoIcon className="w-4 h-4 mt-0.5" />
    <span>This item requires admin approval</span>
  </div>
</List.Notes>
```

## 🔧 Actions and Interactions

### Individual Actions

```tsx
<List.Action
  icon={<EditIcon />}
  label="Edit User"
  onClick={(e) => {
    e.stopPropagation();
    handleEdit();
  }}
  disabled={!canEdit}
/>
```

### Action Groups

```tsx
<List.Actions position="top">
  <List.Action icon={<ViewIcon />} label="View" onClick={handleView} />
  <List.Action icon={<EditIcon />} label="Edit" onClick={handleEdit} />
  <List.Action
    icon={<DeleteIcon />}
    label="Delete"
    onClick={handleDelete}
    className="text-destructive"
  />
</List.Actions>
```

### Dropdown Actions (Expandable Content)

```tsx
<List.Dropdown
  actions={
    <>
      <List.Action icon={<EditIcon />} label="Edit" />
      <List.Action icon={<ShareIcon />} label="Share" />
    </>
  }
  expanded={expanded}
  onExpandedChange={setExpanded}
  contentClassName="bg-muted/20 p-4"
>
  <div className="space-y-4">
    <h4>Project Details</h4>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label>Status</label>
        <Select>...</Select>
      </div>
      <div>
        <label>Priority</label>
        <Select>...</Select>
      </div>
    </div>
  </div>
</List.Dropdown>
```

## 🔄 State Management

### Loading States

```tsx
<List.Container
  isLoading={isLoading}
  loadingComponent={<List.Loading count={5} />}
>
  {/* Content */}
</List.Container>
```

### Empty States

```tsx
<List.Container
  isEmpty={items.length === 0}
  InfoScreenProps={{
    headline: "No projects found",
    description: "Create your first project to get started",
    icon: FolderPlusIcon,
    buttonText: "Create Project",
    buttonOnClick: () => navigate("/projects/new"),
  }}
>
  {/* Content */}
</List.Container>
```

### Custom Empty Component

```tsx
<List.Container
  isEmpty={items.length === 0}
  emptyComponent={
    <div className="text-center py-12">
      <EmptyIllustration className="w-32 h-32 mx-auto mb-4" />
      <h3>No items yet</h3>
      <p>Items will appear here once you add them</p>
      <Button className="mt-4">Add First Item</Button>
    </div>
  }
>
  {/* Content */}
</List.Container>
```

## 🎨 Styling and Theming

### CSS Classes

```tsx
<List.Container className="rounded-lg shadow-lg" contentClassName="divide-y-0">
  <List.Item
    className="hover:bg-blue-50"
    titleClassName="font-bold text-blue-900"
    contentClassName="p-6"
  >
    <List.Title>Styled Item</List.Title>
  </List.Item>
</List.Container>
```

### Custom Components

```tsx
// Custom Search Component
const CustomSearch = ({ value, onChange, placeholder }) => (
  <div className="relative">
    <SearchIcon className="absolute left-3 top-3 w-4 h-4" />
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="pl-10"
    />
  </div>
);

<List.Container SearchComponent={CustomSearch} />;
```

### Motion and Animations

```tsx
<List.Item
  motionProps={{
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.2 },
  }}
>
  <List.Title>Animated Item</List.Title>
</List.Item>
```

## 📊 Data Integration

### Factory Pattern

```tsx
import { createListComponent } from "@acme/ui-web/base/list/list-factory";

// Define your data type
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: "active" | "inactive";
}

// Create specialized component
const UsersList = createListComponent<User, {}>({
  getItemId: (user) => user.id,
  getItemTitle: (user) => user.name,
  getItemDescription: (user) => user.email,

  avatarConfig: {
    getImageUrl: (user) => user.avatar,
    getInitials: (user) =>
      user.name
        .split(" ")
        .map((n) => n[0])
        .join(""),
    size: "md",
    shape: "circle",
  },

  renderItemBadge: (user) => (
    <List.Badge
      text={user.status}
      color={user.status === "active" ? "success" : "warning"}
    />
  ),

  defaultProps: {
    compact: false,
    hideFilter: false,
  },

  emptyStateDefaults: {
    headline: "No users found",
    description: "Add users to get started",
    actionLabel: "Add User",
  },
});

// Use the specialized component
function UsersPage() {
  return (
    <UsersList
      data={users}
      isLoading={isLoading}
      onItemClick={(id) => navigate(`/users/${id}`)}
      onEmptyAction={() => setShowAddUser(true)}
    />
  );
}
```

### Advanced Factory

```tsx
const AdvancedUsersList = createAdvancedListComponent<
  User,
  { showInactive: boolean },
  "users",
  "selectedUserIds",
  "onUserSelect"
>({
  // Custom prop names
  itemPropName: "users",
  selectedPropName: "selectedUserIds",
  selectionHandlerName: "onUserSelect",

  // Same configuration as basic factory
  getItemId: (user) => user.id,
  getItemTitle: (user) => user.name,
  // ... other configs

  // Custom data mapping
  mapDataToProps: (users, props) => ({
    filteredUsers: props.showInactive
      ? users
      : users.filter((u) => u.status === "active"),
  }),

  mapPropsToCallbacks: (props) => ({
    onBulkAction: (action: string, users: User[]) => {
      // Handle bulk operations
    },
  }),
});
```

## 🔌 Hooks and Utilities

### useList Hook

```tsx
import { useList } from "@acme/ui-web/base/list";

function SearchableList() {
  const {
    filterText,
    setFilterText,
    inputText,
    setInputText,
    page,
    setPage,
    pageSize,
    setPageSize,
  } = useList();

  return (
    <List.Container searchTerm={filterText} setSearchTerm={setFilterText}>
      {/* Content */}
    </List.Container>
  );
}
```

### useFilteredList Hook

```tsx
import { useFilteredList } from "@acme/ui-web/base/list";

function FilteredList({ items }) {
  const { filteredItems, paginatedItems, totalPages, currentPage, setPage } =
    useFilteredList(
      items,
      (item) => `${item.name} ${item.email}`, // searchable text
      true, // use debounced search
      true // use pagination
    );

  return (
    <div>
      <List.Container>
        {paginatedItems.map((item) => (
          <List.Item key={item.id}>
            <List.Title>{item.name}</List.Title>
          </List.Item>
        ))}
      </List.Container>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
```

### useRowSelection Hook

```tsx
import { useRowSelection } from "@acme/ui-web/base/list";

function SelectableList({ items }) {
  const {
    selectedKeys,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    getSelectedItems,
  } = useRowSelection({
    initialKeys: [],
    getKey: (item) => item.id,
    onSelectionChange: (keys) => console.log("Selected:", keys),
    maxSelections: 10,
  });

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Button onClick={() => selectAll(items.map((i) => i.id))}>
          Select All
        </Button>
        <Button onClick={clearSelection}>Clear Selection</Button>
        <span>Selected: {selectedKeys.length}</span>
      </div>

      <List.Container>
        {items.map((item) => (
          <List.Item
            key={item.id}
            selected={isSelected(item.id)}
            onClick={() => toggleSelection(item.id)}
          >
            <List.Title>{item.name}</List.Title>
          </List.Item>
        ))}
      </List.Container>
    </div>
  );
}
```

## 🧪 Testing

### Component Testing

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import List from "@acme/ui-web/base/list";

describe("List Component", () => {
  it("renders items correctly", () => {
    render(
      <List.Container>
        <List.Item>
          <List.Title>Test Item</List.Title>
        </List.Item>
      </List.Container>
    );

    expect(screen.getByText("Test Item")).toBeInTheDocument();
  });

  it("handles selection", () => {
    const handleSelection = jest.fn();

    render(
      <List.Container
        isSelectionMode={true}
        onSelectedElementsChange={handleSelection}
      >
        <List.Item ListItemKey="item-1">
          <List.Title>Selectable Item</List.Title>
        </List.Item>
      </List.Container>
    );

    fireEvent.click(screen.getByText("Selectable Item"));
    expect(handleSelection).toHaveBeenCalledWith(["item-1"]);
  });

  it("filters items", () => {
    const handleSearch = jest.fn();

    render(
      <List.Container
        hideFilter={false}
        searchTerm=""
        setSearchTerm={handleSearch}
      >
        {/* Items */}
      </List.Container>
    );

    const searchInput = screen.getByPlaceholderText("Cerca");
    fireEvent.change(searchInput, { target: { value: "test" } });

    expect(handleSearch).toHaveBeenCalledWith("test");
  });
});
```

### DataList Testing

```tsx
describe("DataList Component", () => {
  const mockData = [
    { id: "1", name: "John Doe", role: "Developer" },
    { id: "2", name: "Jane Smith", role: "Designer" },
  ];

  it("renders data correctly", () => {
    render(
      <DataList
        data={mockData}
        getItemId={(item) => item.id}
        getItemTitle={(item) => item.name}
        getItemDescription={(item) => item.role}
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
  });
});
```

## 🚀 Performance Optimization

### Virtualization

```tsx
import { FixedSizeList as VirtualList } from "react-window";

function VirtualizedList({ items }) {
  const ItemRenderer = ({ index, style }) => (
    <div style={style}>
      <List.Item>
        <List.Title>{items[index].name}</List.Title>
      </List.Item>
    </div>
  );

  return (
    <List.Container>
      <VirtualList
        height={400}
        itemCount={items.length}
        itemSize={60}
        itemData={items}
      >
        {ItemRenderer}
      </VirtualList>
    </List.Container>
  );
}
```

### Memoization

```tsx
import { memo, useMemo } from "react";

const MemoizedListItem = memo(({ item, onEdit, onDelete }) => (
  <List.Item key={item.id}>
    <List.Title>{item.name}</List.Title>
    <List.Actions>
      <List.Action
        icon={<EditIcon />}
        label="Edit"
        onClick={() => onEdit(item.id)}
      />
      <List.Action
        icon={<DeleteIcon />}
        label="Delete"
        onClick={() => onDelete(item.id)}
      />
    </List.Actions>
  </List.Item>
));

function OptimizedList({ items, onEdit, onDelete }) {
  const memoizedItems = useMemo(
    () =>
      items.map((item) => (
        <MemoizedListItem
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )),
    [items, onEdit, onDelete]
  );

  return <List.Container>{memoizedItems}</List.Container>;
}
```

## 🔧 Advanced Patterns

### Compound Component Pattern

```tsx
function ComplexList() {
  return (
    <List.Container variant="gallery" compact={false}>
      {/* Header Actions */}
      <List.Actions position="top">
        <List.Action icon={<PlusIcon />} label="Add Item" />
        <List.Action icon={<FilterIcon />} label="Filter" />
      </List.Actions>

      {/* Items */}
      {items.map((item) => (
        <List.Item key={item.id}>
          {/* Avatar */}
          <List.Avatar
            src={item.avatar}
            firstName={item.firstName}
            lastName={item.lastName}
          />

          {/* Content */}
          <List.Title className="font-bold">{item.name}</List.Title>
          <List.Description>{item.bio}</List.Description>

          {/* Badges */}
          <List.Badges>
            {item.skills.map((skill) => (
              <List.Badge key={skill} text={skill} size="sm" />
            ))}
          </List.Badges>

          {/* Notes */}
          <List.Notes>
            <div className="text-sm text-muted-foreground">
              Last active: {formatDate(item.lastActive)}
            </div>
          </List.Notes>

          {/* Expandable Actions */}
          <List.Dropdown
            actions={
              <>
                <List.Action icon={<MessageIcon />} label="Message" />
                <List.Action icon={<CallIcon />} label="Call" />
                <List.Action icon={<MoreIcon />} label="More" />
              </>
            }
          >
            <UserDetails user={item} />
          </List.Dropdown>
        </List.Item>
      ))}

      {/* Footer Actions */}
      <List.Actions position="bottom">
        <List.Action icon={<LoadMoreIcon />} label="Load More" />
      </List.Actions>
    </List.Container>
  );
}
```

### Render Props Pattern

```tsx
function RenderPropsList({ children, ...props }) {
  return (
    <List.Container {...props}>
      {children({
        Item: List.Item,
        Title: List.Title,
        Description: List.Description,
        Avatar: List.Avatar,
        Badge: List.Badge,
        Actions: List.Actions,
        Action: List.Action,
      })}
    </List.Container>
  );
}

// Usage
<RenderPropsList>
  {({ Item, Title, Avatar }) =>
    users.map((user) => (
      <Item key={user.id}>
        <Avatar src={user.avatar} />
        <Title>{user.name}</Title>
      </Item>
    ))
  }
</RenderPropsList>;
```

## 🌍 Internationalization

```tsx
import { useTranslation } from "react-i18next";

function InternationalizedList() {
  const { t } = useTranslation("lists");

  return (
    <List.Container
      placeholder={t("search.placeholder")}
      InfoScreenProps={{
        headline: t("empty.headline"),
        description: t("empty.description"),
        buttonText: t("empty.action"),
      }}
    >
      {items.map((item) => (
        <List.Item key={item.id}>
          <List.Title>{item.name}</List.Title>
          <List.Actions>
            <List.Action icon={<EditIcon />} label={t("actions.edit")} />
            <List.Action icon={<DeleteIcon />} label={t("actions.delete")} />
          </List.Actions>
        </List.Item>
      ))}
    </List.Container>
  );
}
```

## 📱 Responsive Design

```tsx
function ResponsiveList() {
  return (
    <List.Container
      variant="list" // Desktop: list, Mobile: auto-adjusts
      className="
        sm:max-h-96 
        md:max-h-none 
        lg:grid lg:grid-cols-2 lg:gap-4
      "
      compact={false} // Auto-compact on mobile
    >
      {items.map((item) => (
        <List.Item
          key={item.id}
          className="
            sm:flex-col sm:items-start
            md:flex-row md:items-center
          "
          inlineDescription={false} // Stack on mobile
        >
          <List.Avatar
            className="
              h-8 w-8 sm:h-12 sm:w-12 md:h-10 md:w-10
            "
          />
          <List.Title className="text-sm sm:text-base">{item.name}</List.Title>
          <List.Description className="hidden sm:block">
            {item.description}
          </List.Description>
        </List.Item>
      ))}
    </List.Container>
  );
}
```

## 🔌 API Integration

### React Query Integration

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function QueryIntegratedList() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  if (error) {
    return (
      <List.Container
        isEmpty={true}
        InfoScreenProps={{
          headline: "Error loading data",
          description: error.message,
          icon: AlertCircleIcon,
          buttonText: "Retry",
          buttonOnClick: () =>
            queryClient.refetchQueries({ queryKey: ["users"] }),
        }}
      />
    );
  }

  return (
    <DataList
      data={data || []}
      isLoading={isLoading}
      getItemId={(user) => user.id}
      getItemTitle={(user) => user.name}
      renderItemActions={(user) => (
        <List.Actions>
          <List.Action
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => deleteMutation.mutate(user.id)}
            disabled={deleteMutation.isPending}
          />
        </List.Actions>
      )}
      emptyStateProps={{
        headline: "No users found",
        description: "Get started by adding your first user",
        actionLabel: "Add User",
        onAction: () => navigate("/users/new"),
      }}
    />
  );
}
```

### GraphQL Integration

```tsx
import { useQuery, gql } from "@apollo/client";

const GET_USERS = gql`
  query GetUsers($filter: UserFilter, $pagination: PaginationInput) {
    users(filter: $filter, pagination: $pagination) {
      nodes {
        id
        name
        email
        avatar
        status
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        totalCount
      }
    }
  }
`;

function GraphQLList() {
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ first: 10 });

  const { data, loading, error, fetchMore } = useQuery(GET_USERS, {
    variables: { filter: filters, pagination },
  });

  return (
    <div>
      <FilterComponent onFiltersChange={setFilters} />

      <DataList
        data={data?.users?.nodes || []}
        isLoading={loading}
        getItemId={(user) => user.id}
        getItemTitle={(user) => user.name}
        getItemDescription={(user) => user.email}
        renderItemIcon={(user) => <List.Avatar src={user.avatar} />}
        renderItemBadge={(user) => (
          <List.Badge
            text={user.status}
            color={user.status === "ACTIVE" ? "success" : "warning"}
          />
        )}
      />

      {data?.users?.pageInfo?.hasNextPage && (
        <Button
          onClick={() =>
            fetchMore({
              variables: {
                pagination: {
                  ...pagination,
                  after: data.users.pageInfo.endCursor,
                },
              },
            })
          }
          className="w-full mt-4"
        >
          Load More
        </Button>
      )}
    </div>
  );
}
```

## 🎯 TypeScript Patterns

### Generic List Component

```tsx
interface ListComponentProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  getItemKey: (item: T) => string;
  onItemSelect?: (item: T) => void;
}

function GenericList<T>({
  items,
  renderItem,
  getItemKey,
  onItemSelect,
}: ListComponentProps<T>) {
  return (
    <List.Container>
      {items.map((item) => (
        <List.Item key={getItemKey(item)} onClick={() => onItemSelect?.(item)}>
          {renderItem(item)}
        </List.Item>
      ))}
    </List.Container>
  );
}

// Usage with type safety
interface User {
  id: string;
  name: string;
  email: string;
}

<GenericList<User>
  items={users}
  getItemKey={(user) => user.id}
  renderItem={(user) => (
    <>
      <List.Title>{user.name}</List.Title>
      <List.Description>{user.email}</List.Description>
    </>
  )}
  onItemSelect={(user) => {
    // user is properly typed as User
    console.log(user.name);
  }}
/>;
```

### Type-safe Factories

```tsx
// Define your data shape
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

// Create type-safe component factory
const ProductsList = createListComponent<
  Product,
  {
    showOutOfStock: boolean;
    onAddToCart: (productId: string) => void;
  }
>({
  getItemId: (product) => product.id,
  getItemTitle: (product) => product.name,
  getItemDescription: (product) => `$${product.price} • ${product.category}`,

  renderItemBadge: (product) => (
    <List.Badge
      text={product.inStock ? "In Stock" : "Out of Stock"}
      color={product.inStock ? "success" : "warning"}
    />
  ),

  renderItemActions: (product, onAction) => (
    <List.Actions>
      <List.Action
        icon={<CartIcon />}
        label="Add to Cart"
        onClick={() => onAction("add-to-cart")}
        disabled={!product.inStock}
      />
    </List.Actions>
  ),

  defaultProps: {
    compact: false,
  },
});

// Usage with full type safety
<ProductsList
  data={products}
  showOutOfStock={true} // Custom prop with type checking
  onAddToCart={(productId) => {
    // productId is typed as string
    addToCart(productId);
  }}
  onActionPerformed={(action, product) => {
    // Both action and product are properly typed
    if (action === "add-to-cart") {
      addToCart(product.id);
    }
  }}
/>;
```

## 🛠️ Development Tools

### Debug Component

```tsx
import { ListDebugger } from "@acme/ui-web/base/list/debug";

function DebuggableList() {
  return (
    <ListDebugger enabled={process.env.NODE_ENV === "development"}>
      <List.Container>{/* Your list content */}</List.Container>
    </ListDebugger>
  );
}
```

### DevTools Integration

```tsx
// Add to your dev environment
import { ListDevTools } from "@acme/ui-web/base/list/dev-tools";

function App() {
  return (
    <div>
      {/* Your app */}
      {process.env.NODE_ENV === "development" && <ListDevTools />}
    </div>
  );
}
```

## 📈 Migration Guide

### From Simple Lists

**Before:**

```tsx
<div className="space-y-2">
  {items.map((item) => (
    <div key={item.id} className="p-4 border rounded">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  ))}
</div>
```

**After:**

```tsx
<List.Container>
  {items.map((item) => (
    <List.Item key={item.id}>
      <List.Title>{item.title}</List.Title>
      <List.Description>{item.description}</List.Description>
    </List.Item>
  ))}
</List.Container>
```

### From Custom Components

**Before:**

```tsx
function UserItem({ user, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-3">
        <img src={user.avatar} className="w-8 h-8 rounded-full" />
        <div>
          <h4>{user.name}</h4>
          <p>{user.email}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button onClick={() => onEdit(user.id)}>Edit</button>
        <button onClick={() => onDelete(user.id)}>Delete</button>
      </div>
    </div>
  );
}
```

**After:**

```tsx
<List.Item>
  <List.Avatar src={user.avatar} />
  <List.Title>{user.name}</List.Title>
  <List.Description>{user.email}</List.Description>
  <List.Actions>
    <List.Action
      icon={<EditIcon />}
      label="Edit"
      onClick={() => onEdit(user.id)}
    />
    <List.Action
      icon={<DeleteIcon />}
      label="Delete"
      onClick={() => onDelete(user.id)}
    />
  </List.Actions>
</List.Item>
```

## 🔍 Troubleshooting

### Common Issues

**Actions not appearing:**

- Ensure actions are direct children of `List.Item`
- Check that `List.Action` components have required props
- Verify proper import statements

**Search not working:**

- Confirm `hideFilter={false}` is set
- Check `searchTerm` and `setSearchTerm` props are provided
- Ensure search logic is implemented in parent component

**Selection not functioning:**

- Set `isSelectionMode={true}` on `List.Container`
- Provide `ListItemKey` prop on each `List.Item`
- Implement `onSelectedElementsChange` callback

**Styling issues:**

- Check Tailwind CSS is properly configured
- Verify component imports are correct
- Review custom className props for conflicts

## 📚 Resources

- [Component Playground](https://storybook.ownfit.app/list)
- [API Documentation](https://docs.ownfit.app/components/list)
- [Examples Repository](https://github.com/ownfit/ui-examples)
- [Design System](https://design.ownfit.app)

## 🤝 Contributing

See our [Contributing Guide](../../../CONTRIBUTING.md) for details on how to contribute to the List component system.

## 📄 License

MIT License - see [LICENSE](../../../LICENSE) for details.
