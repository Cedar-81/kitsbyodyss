# Row-Level Security (RLS) Setup Guide for Odyssv4

## Overview
This guide documents the **Row-Level Security (RLS) policies** that should be implemented in your Supabase database to enforce authorization at the database level. This provides a critical security layer that prevents even direct database queries from bypassing your app's authorization rules.

## Why RLS?
- **Defense in depth**: Protects against bypassing client-side checks
- **Direct query protection**: Prevents unauthorized API calls to Supabase
- **Single source of truth**: Authorizes data access at the source

## Current Frontend Implementation
The frontend now has authorization checks that:
1. Check if user is the kit owner OR kit is published (for viewing items)
2. Check if user is the kit owner (for creating/editing items)
3. Redirect unauthorized users

However, **RLS policies ensure these rules are enforced at the database level**.

---

## RLS Policies to Implement

### 1. **overview Table - Read Access**
Users can view an overview if:
- They are the owner, OR
- The overview is published

```sql
CREATE POLICY "Users can view their own or published overviews"
ON overview
FOR SELECT
USING (
  auth.uid()::text = user_id OR published = true
);
```

### 2. **overview Table - Insert/Update/Delete Access**
Users can only modify their own overviews

```sql
CREATE POLICY "Users can only modify their own overviews"
ON overview
FOR ALL
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);
```

### 3. **food Table - Read Access**
Users can view food items if:
- They are the creator of the item, OR
- The food's parent overview is published or they own it

```sql
CREATE POLICY "Users can view food items from accessible kits"
ON food
FOR SELECT
USING (
  auth.uid()::text = user_id OR 
  EXISTS (
    SELECT 1 FROM overview 
    WHERE overview.id = food.overview_id 
    AND (overview.user_id = auth.uid()::text OR overview.published = true)
  )
);
```

### 4. **food Table - Insert/Update/Delete Access**
Users can only modify food items if they own the parent kit

```sql
CREATE POLICY "Users can only modify food items in their kits"
ON food
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM overview 
    WHERE overview.id = food.overview_id 
    AND overview.user_id = auth.uid()::text
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM overview 
    WHERE overview.id = food.overview_id 
    AND overview.user_id = auth.uid()::text
  )
);
```

### 5. **accommodation Table - Read Access**
Same pattern as food:

```sql
CREATE POLICY "Users can view accommodation items from accessible kits"
ON accommodation
FOR SELECT
USING (
  auth.uid()::text = user_id OR 
  EXISTS (
    SELECT 1 FROM overview 
    WHERE overview.id = accommodation.overview_id 
    AND (overview.user_id = auth.uid()::text OR overview.published = true)
  )
);
```

### 6. **accommodation Table - Insert/Update/Delete Access**

```sql
CREATE POLICY "Users can only modify accommodation items in their kits"
ON accommodation
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM overview 
    WHERE overview.id = accommodation.overview_id 
    AND overview.user_id = auth.uid()::text
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM overview 
    WHERE overview.id = accommodation.overview_id 
    AND overview.user_id = auth.uid()::text
  )
);
```

### 7. **transportation Table - Read Access**

```sql
CREATE POLICY "Users can view transportation items from accessible kits"
ON transportation
FOR SELECT
USING (
  auth.uid()::text = user_id OR 
  EXISTS (
    SELECT 1 FROM overview 
    WHERE overview.id = transportation.overview_id 
    AND (overview.user_id = auth.uid()::text OR overview.published = true)
  )
);
```

### 8. **transportation Table - Insert/Update/Delete Access**

```sql
CREATE POLICY "Users can only modify transportation items in their kits"
ON transportation
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM overview 
    WHERE overview.id = transportation.overview_id 
    AND overview.user_id = auth.uid()::text
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM overview 
    WHERE overview.id = transportation.overview_id 
    AND overview.user_id = auth.uid()::text
  )
);
```

### 9. **activities Table - Read Access**

```sql
CREATE POLICY "Users can view activity items from accessible kits"
ON activities
FOR SELECT
USING (
  auth.uid()::text = user_id OR 
  EXISTS (
    SELECT 1 FROM overview 
    WHERE overview.id = activities.overview_id 
    AND (overview.user_id = auth.uid()::text OR overview.published = true)
  )
);
```

### 10. **activities Table - Insert/Update/Delete Access**

```sql
CREATE POLICY "Users can only modify activity items in their kits"
ON activities
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM overview 
    WHERE overview.id = activities.overview_id 
    AND overview.user_id = auth.uid()::text
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM overview 
    WHERE overview.id = activities.overview_id 
    AND overview.user_id = auth.uid()::text
  )
);
```

### 11. **profile Table - Access Control**
Users can only read/modify their own profile

```sql
CREATE POLICY "Users can view their own profile"
ON profile
FOR SELECT
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can only modify their own profile"
ON profile
FOR UPDATE
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);
```

---

## Implementation Steps

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Click on "SQL Editor"

2. **Enable RLS on tables**
   - Go to Authentication → Policies
   - Or use the table settings
   - Enable RLS for: `overview`, `food`, `accommodation`, `transportation`, `activities`, `profile`

3. **Run the SQL policies above**
   - Copy each policy and run it in the SQL Editor
   - Verify each policy is created

4. **Test the policies**
   - Try accessing data as different users
   - Verify unauthorized access is blocked
   - Ensure published kits are still accessible

---

## Testing the RLS Policies

### Test 1: Unauthorized Item Access
```javascript
// This should FAIL with unauthorized access
const { data } = await supabase
  .from('food')
  .select('*')
  .eq('overview_id', 'someone-elses-kit-id')
```

### Test 2: Published Kit Access
```javascript
// This should SUCCEED - kit is published
const { data } = await supabase
  .from('food')
  .select('*')
  .eq('overview_id', 'published-kit-id')
```

### Test 3: Owner Kit Access
```javascript
// This should SUCCEED - you own the kit
const { data } = await supabase
  .from('food')
  .select('*')
  .eq('overview_id', 'my-own-kit-id')
```

---

## Important Notes

1. **Auth UUID Format**: The policies use `auth.uid()::text` to match your `user_id` format (text/string)
   - If your user_id is stored differently, adjust accordingly

2. **Performance**: Consider adding indexes on `user_id` and `overview_id` columns for faster query execution:
   ```sql
   CREATE INDEX idx_food_overview_id ON food(overview_id);
   CREATE INDEX idx_food_user_id ON food(user_id);
   CREATE INDEX idx_overview_user_id ON overview(user_id);
   ```

3. **Service Role**: The `service_role` key can bypass RLS (intended for admin operations)
   - Only use it in secure backend operations
   - Never expose it client-side

4. **Testing with Supabase CLI**:
   ```bash
   # Test policies without running client code
   supabase functions test rls-test
   ```

---

## Security Layers (Defense in Depth)

1. ✅ **Frontend Authorization** (implemented in this fix)
   - User-friendly redirects
   - Prevents accidental unauthorized access

2. ✅ **RLS Policies** (in this guide)
   - Database-level enforcement
   - Prevents API bypassing

3. 🔄 **API Rate Limiting** (recommended)
   - Prevents brute force attacks
   - Configure in Supabase Auth settings

4. 🔄 **Audit Logging** (recommended)
   - Log unauthorized access attempts
   - Use Supabase's database webhooks

---

## Next Steps

1. Implement the RLS policies above in your Supabase database
2. Test thoroughly with different user accounts
3. Monitor for any issues in production
4. Consider adding API rate limiting for extra protection
