Scaffold a new feature based on the boilerplate conventions.

Ask for the feature name (e.g., "order", "product", "blog"), then create:

1. **Page**: `src/app/[locale]/(main)/[feature]/page.tsx`
   - Client component with basic layout
   - Use `useTranslations` for i18n

2. **Types**: `src/types/[feature].ts`
   - Interface for the main entity (e.g., `IOrder`)
   - Interface for create/update payload
   - Export all types explicitly

3. **Service**: `src/services/[feature]-service.ts`
   - Import `_get`, `_post`, `_put`, `_delete` from `api-service`
   - CRUD methods with proper types
   - Follow existing service pattern

4. **Components**: `src/components/[feature]/`
   - Create a list component using Ant Design `Table` with server-side pagination
   - Use React Query `useQuery` for data fetching
   - Follow file order: imports → component → styled-components

5. **Translations**: Add keys to both
   - `src/messages/th/common.json`
   - `src/messages/en/common.json`

6. **Route protection**: Add path to `PROTECTED_ROUTES` in `src/proxy.ts` if it requires auth

After creating all files, run `pnpm build` to verify no errors.
