// This file is duplicated from the packages/ui.
// Since the entire packages/ui library is marked with directive
// "use client", the components exported from it can be used only
// as client components.
// This function can be useful for backend components as well,
// so it has been copied here without directive.

export const cx = (...classNames: any[]): string => {
  let classes = [];
  for (const currentClass of classNames) {
    if (!currentClass) continue;

    if (typeof currentClass === "string") {
      classes.push(currentClass);
      continue;
    }

    if (Array.isArray(currentClass)) {
      classes.push(cx(...currentClass));
      continue;
    }

    if (typeof currentClass === "object") {
      // Ensure it does not loop through whole prototype chain
      for (const key in currentClass)
        if (currentClass.hasOwnProperty(key) && Boolean(currentClass[key])) {
          classes.push(key);
        }
    }
  }

  return classes.join(" ");
};
