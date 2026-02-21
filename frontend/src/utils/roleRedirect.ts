export const getDashboardRoute = (role: string) => {
  switch (role) {
    case "Admin":
      return "/admin/dashboard";
    case "Guide":
      return "/guide/dashboard";
    case "Tourist":
    default:
      return "/dashboard";
  }
};