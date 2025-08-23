export interface Team {
  name: string;
  plan: string;
  id: string;
}

export interface ActiveTeam {
  name: string;
  plan: string;
}

export interface OrganizationSwitcherProps {
  teams: Team[];
  activeTeam: ActiveTeam;
  onTeamChange: (team: Team) => void | Promise<void>;
  onAddTeam: () => void | Promise<void>;
  onSettings?: (team: Team) => void;
  isLoading?: boolean;
}
