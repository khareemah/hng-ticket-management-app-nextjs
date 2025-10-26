export interface ValidationError {
  field: string;
  message: string;
}

export function validateTicket(data: {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.title || data.title.trim() === "") {
    errors.push({ field: "title", message: "Title is required" });
  } else if (data.title.length > 200) {
    errors.push({
      field: "title",
      message: "Title must be less than 200 characters",
    });
  }

  if (data.description && data.description.length > 2000) {
    errors.push({
      field: "description",
      message: "Description must be less than 2000 characters",
    });
  }

  if (
    !data.status ||
    !["open", "in_progress", "closed"].includes(data.status)
  ) {
    errors.push({
      field: "status",
      message: "Status must be open, in_progress, or closed",
    });
  }

  if (data.priority && !["low", "medium", "high"].includes(data.priority)) {
    errors.push({
      field: "priority",
      message: "Priority must be low, medium, or high",
    });
  }

  return errors;
}

// export function validateSignup(
//   email: string,
//   password: string,
//   name: string
// ): ValidationError[] {
//   const errors: ValidationError[] = [];

//   if (!name || name.trim() === "") {
//     errors.push({ field: "name", message: "Name is required" });
//   }

//   if (!email || email.trim() === "") {
//     errors.push({ field: "email", message: "Email is required" });
//   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//     errors.push({ field: "email", message: "Please enter a valid email" });
//   }

//   if (!password || password.trim() === "") {
//     errors.push({ field: "password", message: "Password is required" });
//   } else if (password.length < 6) {
//     errors.push({
//       field: "password",
//       message: "Password must be at least 6 characters",
//     });
//   }

//   return errors;
// }
