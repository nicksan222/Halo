# Shell v2

A composable Shell component that provides a layout wrapper with header, content, and actions. Built using the composition pattern in React.

## What's new

- Actions now support a numeric `position` prop for deterministic ordering. Lower numbers render first. Falls back to `order` (deprecated), then insertion order.
- Internal state refactored to a lightweight Zustand store. No API changes required; `Shell.Provider` remains for compatibility.

## SSR and Client usage

- The default export is SSR-safe and can be imported in Server Components. Interactive subcomponents are loaded client-side automatically.

```tsx
// Server Component (SSR safe)
import Shell from "@acme/ui/components/shell";

export default async function Page() {
  return (
    <Shell>
      <Shell.Header>
        <Shell.Back href="/dashboard" />
        <Shell.Title>My Page</Shell.Title>
        <Shell.Description>Server rendered layout</Shell.Description>
        {/* Prefer href-based navigation on the server. For onClick handlers, see client entry below. */}
      </Shell.Header>
      <Shell.TabContainer position="side">
        <Shell.Tab title="Overview" href="/overview" />
      </Shell.TabContainer>
      <Shell.Content>...</Shell.Content>
    </Shell>
  );
}
```

- For full client-side interactivity (e.g. passing `onClick` handlers), import the client entry.

```tsx
"use client";
import Shell from "@acme/ui/components/shell/client";

export default function ClientPage() {
  return (
    <Shell>
      <Shell.Header>
        <Shell.Action text="Run" onClick={() => console.log("clicked")} />
      </Shell.Header>
      <Shell.Content>...</Shell.Content>
    </Shell>
  );
}
```

## Usage

### Automatic Layout (Recommended)

The Shell component automatically detects when you have a side TabContainer and Content, and applies the proper grid layout:

```tsx
import Shell from "@acme/ui-web/components/base/shell";

export default function MyPage() {
  return (
    <Shell>
      <Shell.Header>
        <Shell.Back href="/dashboard" />
        <Shell.Title>My Page Title</Shell.Title>
        <Shell.Description>Some description about this page</Shell.Description>
        {/* Actions with numeric positions */}
        <Shell.Action
          text="Primary Action"
          variant="default"
          onClick={() => console.log("Primary action")}
          position={1}
        />
        <Shell.Action
          text="Secondary"
          variant="secondary"
          onClick={() => console.log("Secondary")}
          position={2}
        />
      </Shell.Header>

      {/* Side navigation - automatically positioned in grid */}
      <Shell.TabContainer position="side">
        <Shell.Tab
          title="Dashboard"
          icon={<HomeIcon />}
          onClick={() => console.log("Dashboard")}
        />
        <Shell.Tab
          title="Profile"
          description="View your profile information"
          icon={<UserIcon />}
          isActive={true}
          onClick={() => console.log("Profile")}
        />
        <Shell.Tab
          title="Settings"
          description="Manage preferences"
          icon={<SettingsIcon />}
          onClick={() => console.log("Settings")}
        />
      </Shell.TabContainer>

      {/* Optional: Top tabs can be mixed with side tabs */}
      <Shell.TabContainer position="top">
        <Shell.Tab
          title="Overview"
          isActive={true}
          onClick={() => console.log("Overview")}
        />
        <Shell.Tab title="Details" onClick={() => console.log("Details")} />
      </Shell.TabContainer>

      {/* Content - automatically positioned in grid */}
      <Shell.Content>Your main content goes here</Shell.Content>
    </Shell>
  );
}
```

### Manual Layout

If you need more control over the layout, you can disable automatic layout:

```tsx
export default function MyPageManual() {
  return (
    <Shell autoLayout={false}>
      <Shell.Header>{/* header content */}</Shell.Header>

      <div className="flex flex-col md:flex-row">
        {/* Custom layout structure */}
        <div className="w-full px-4 pt-2 md:w-64 md:pl-8 md:pr-0">
          <Shell.TabContainer position="side">{/* tabs */}</Shell.TabContainer>
        </div>

        <div className="flex flex-1 flex-col">
          <Shell.Content>Your main content goes here</Shell.Content>
        </div>
      </div>
    </Shell>
  );
}
```

## Responsive Behavior

The Shell component handles responsive layouts automatically:

- **Mobile**: All tabs display horizontally in a scrollable container
- **Desktop**:
  - Tabs with `position="side"` display vertically in a sidebar
  - Tabs with `position="top"` remain horizontal

This responsive behavior is built-in and requires no additional configuration.

## Components

### Shell

The root component that wraps all other components.

```tsx
<Shell
  isLoading={false}
  isEmpty={false}
  isError={false}
  flexChildrenContainer={true}
>
  {/* other shell components */}
</Shell>
```

#### Props

- `children`: ReactNode - The content of the shell
- `className`: string (optional) - Additional class names
- `isLoading`: boolean (optional) - Whether the shell is in a loading state
- `isEmpty`: boolean (optional) - Whether the shell is in an empty state
- `isError`: boolean (optional) - Whether the shell is in an error state
- `errorMessage`: string (optional) - Error message to display
- `emptyProps`: EmptyScreenProps (optional) - Custom empty state props
- `errorProps`: EmptyScreenProps (optional) - Custom error state props
- `flexChildrenContainer`: boolean (optional) - Whether to make the children container flex
- `autoLayout`: boolean (optional) - Whether to automatically apply grid layout when side tabs and content are detected (default: true)

### Shell.Header

Container for the header section of the shell.

```tsx
<Shell.Header className="custom-header-class">
  {/* 
    Recommended layout:
    - Place <Shell.Back /> before <Shell.Title> and <Shell.Description> for best appearance.
    - Group them in a flex container for alignment.
  */}
  <div className="flex items-center space-x-2">
    <Shell.Back href="/previous-page" />
    <div>
      <Shell.Title>Page Title</Shell.Title>
      <Shell.Description>Some description</Shell.Description>
    </div>
  </div>
  {/* Actions, etc. */}
</Shell.Header>
```

#### Props

- `children`: ReactNode - The content of the header
- `className`: string (optional) - Additional class names

### Shell.Back

Back button component with navigation functionality.

```tsx
<Shell.Back href="/previous-page" />
// or
<Shell.Back onClick={() => history.back()} />
```

#### Props

- `href`: string (optional) - URL to navigate to when clicked
- `onClick`: () => void (optional) - Function to execute when clicked

### Shell.Title

Title component for the shell.

```tsx
<Shell.Title smallHeading={false} hideOnMobile={false}>
  Page Title
</Shell.Title>
```

#### Props

- `children`: ReactNode - The title content
- `className`: string (optional) - Additional class names
- `smallHeading`: boolean (optional) - Whether to use a smaller font size
- `hideOnMobile`: boolean (optional) - Whether to hide on mobile devices

### Shell.Description

Description component for additional context below the title.

```tsx
<Shell.Description>This is a description of the page.</Shell.Description>
```

#### Props

- `children`: ReactNode - The description content
- `className`: string (optional) - Additional class names

### Shell.Action

Action button component for header actions.

```tsx
<Shell.Action
  text="Create"
  icon={<PlusIcon />}
  variant="default"
  onClick={() => console.log("Create")}
  position={1} // lower number shows first
/>
```

#### Props

- `text`: string (optional) - Button text
- `icon`: ReactNode (optional) - Icon to display
- `variant`: ActionVariant (optional) - Button variant (default, secondary, destructive, outline, ghost, link)
- `onClick`: () => void (optional) - Function to execute when clicked
- `href`: string (optional) - URL to navigate to when clicked
- `className`: string (optional) - Additional class names
- `position`: number (optional) - Sorting position; lower values render earlier
- `order`: number (optional, deprecated) - Legacy field; use `position` instead

### Shell.TabContainer

Container for tab components with responsive behavior.

```tsx
{
  /* Side position - horizontal on mobile, vertical on desktop */
}
<Shell.TabContainer position="side">{/* Tab components */}</Shell.TabContainer>;

{
  /* Top position - always horizontal */
}
<Shell.TabContainer position="top">{/* Tab components */}</Shell.TabContainer>;
```

#### Props

- `children`: ReactNode - The tab components
- `className`: string (optional) - Additional class names
- `position`: 'top' | 'side' (optional) - Tab layout position, defaults to 'top'
  - `top`: Always horizontal on all screen sizes
  - `side`: Horizontal on mobile, vertical on desktop

### Shell.Tab

Individual tab component for navigation.

```tsx
<Shell.Tab
  title="Settings"
  description="Manage your account settings"
  icon={<CogIcon />}
  isActive={true}
  onClick={() => navigate("/settings")}
/>
```

#### Props

- `title`: string - Tab title
- `description`: string (optional) - Tab description (shown only on desktop for side position)
- `icon`: ReactNode (optional) - Icon to display
- `isActive`: boolean (optional) - Whether the tab is active
- `onClick`: () => void (optional) - Function to execute when clicked
- `href`: string (optional) - URL to navigate to when clicked

### Shell.Content

Container for the main content of the shell.

```tsx
<Shell.Content>{/* Main content */}</Shell.Content>
```

#### Props

- `children`: ReactNode - The main content
- `className`: string (optional) - Additional class names

### Shell.Layout

Manual layout component for advanced use cases where you need explicit control over the grid layout.

```tsx
<Shell autoLayout={false}>
  <Shell.Header>{/* header */}</Shell.Header>
  <Shell.Layout>
    <Shell.TabContainer position="side">{/* tabs */}</Shell.TabContainer>
    <Shell.Content>{/* content */}</Shell.Content>
  </Shell.Layout>
</Shell>
```

#### Props

- `children`: ReactNode - The content to layout
- `className`: string (optional) - Additional class names

**Note**: The Layout component is automatically used when `autoLayout={true}` (default), so you typically don't need to use it directly.
