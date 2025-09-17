export function keysToLowerCase<T extends Record<string, any>>(obj: T): any {
  if (Array.isArray(obj)) {
    return obj.map(keysToLowerCase);
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key.toLowerCase()] = keysToLowerCase(obj[key]);
      return acc;
    }, {} as Record<string, any>);
  }
  return obj;
}
