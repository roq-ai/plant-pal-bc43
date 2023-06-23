const mapping: Record<string, string> = {
  'care-instructions': 'care_instruction',
  plants: 'plant',
  providers: 'provider',
  reminders: 'reminder',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
