export interface Organization {
  name: string;
  plan: string;
  id: string;
}

export interface ActiveOrganization {
  name: string;
  plan: string;
}

export interface OrganizationSwitcherLabels {
  organizations: string;
  addOrganization: string;
  settings: string;
}

export interface OrganizationSwitcherProps {
  organizations: Organization[];
  activeOrganization: ActiveOrganization;
  onOrganizationChange: (organization: Organization) => void | Promise<void>;
  onAddOrganization: () => void | Promise<void>;
  onSettings?: (organization: Organization) => void;
  isLoading?: boolean;
  labels?: OrganizationSwitcherLabels;
}
