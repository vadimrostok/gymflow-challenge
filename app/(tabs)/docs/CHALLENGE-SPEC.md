# Gymflow Frontend Test Task

---

## Task Outline:

Build a small application consisting of:

1. A Web app using React;
2. A Mobile app using React Native;
3. Optionally: a shared codebase (monorepo structure) to reuse utils, hooks, forms, and validation logic between platforms.

Using a monorepo is optional, but recommended for a cleaner structure and reusability.

<aside>
🤖

We encourage the use of AI tools in coding BUT beware, we are reviewing the code as if it’s your own. Expect to be asked about how/why things we implemented and explain your decisions and know your codebase.

</aside>

---

## Tech Stack

1. General:
   1. TypeScript;
   2. React Hook Form;
   3. Zod (for validations);
   4. Tailwind CSS (it's important for web, but not important for mobile);
   5. MobX or Redux or Context API or any other state manager (or if you have BE development skills, feel free to create some small BE part for create/edit/show data and use tanstack react query);
   6. Luxon;
2. Web:
   1. React;
   2. React Router;
   3. Motion (or any other solution for animation);
3. Mobile:
   1. React Native;
   2. React Navigation;
   3. React Native Reanimated (for animation).

---

## Task Details

### **Web Application**

1. Create 2 pages:
   1. Table page, with a list of users;
   2. Create/Edit user page:
      1. Reusable form for:
         1. Create user;
         2. Edit user;
      2. Form should have:
         1. "Full Name" field;
         2. "Role" selector:
            1. Staff;
            2. Member;
         3. "Date of Birthday" field (date picker or just input field);
      3. "Remove User" button (only shown in Edit mode);
2. Implement a responsive design (mobile and desktop).

### **Mobile Application**

1. Create 2 screens:
   1. List screen, with a list of users;
   2. Create/Edit user screen:
      1. Reusable form for:
         1. Create user;
         2. Edit user;
      2. Form should have:
         1. "Full Name" field;
         2. "Role" selector:
            1. Staff;
            2. Member;
         3. "Date of Birthday" field (date picker);
      3. "Remove User" button (only shown in Edit mode);
2. The same design for iOS and Android (not required for date picker).

### General Tasks

1. You can create one/two unit tests for any part of the codebase;
2. Validations for the user form:
   1. Full Name - string, min 3 characters, max 50 characters, required field;
   2. Role - "STAFF" or "MEMBER" type, required field;
   3. Date of Birthday - string, ISO format, optional field;
3. Add any animation (up to you).

---

## Delivery

1. Create a public GitHub repo and push all changes;
2. Instructions to run both the Web and Mobile apps (in README file);
3. Send us the link to [isaac@gymflow.io](mailto:isaac@gymflow.io)