import { supabase } from "./supabase";

 
export const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error("Login error:", error.message);
    }
};

export const handleGoogleLogout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
      console.error("Login error:", error.message);
  }
}


  export const uploadImage = async (file: File) => {
    const user = (await supabase.auth.getUser()).data.user;
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${user?.id}/${fileName}.png`;;

    const { error } = await supabase.storage
        .from("images")
        .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

    return data.publicUrl;
};


/* =========================================
   OVERVIEW CRUD
========================================= */

export const OverviewAPI = {
  create: async (data: any) => {
    return await supabase.from("overview").insert([data]).select().single();
  },

  getById: async (id: string) => {
    return await supabase
      .from("overview")
      .select(`
        *,
        activities (*),
        food (*),
        accommodation (*)
      `)
      .eq("id", id)
      .single();
  },

  getByUser: async (user_id: string) => {
    return await supabase      
      .from("overview")
      .select("*")
      .eq("user_id", user_id);
  },

  update: async (id: string, updates: any) => {
    return await supabase
      .from("overview")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
  },

  delete: async (id: string) => {
    return await supabase.from("overview").delete().eq("id", id);
  },
};

/* =========================================
   GENERIC CHILD TABLE CRUD
========================================= */

const createChildAPI = (table: string) => ({
  create: async (data: any) => {
    return await supabase.from(table).insert([data]).select().single();
  },

  getByOverview: async (overview_id: string) => {
    return await supabase
      .from(table)
      .select("*")
      .eq("overview_id", overview_id);
  },

  getByUserId: async (user_id: string) => {
    return await supabase
      .from(table)
      .select("*")
      .eq("user_id", user_id);
  },

  update: async (id: string, updates: any) => {
    return await supabase
      .from(table)
      .update(updates)
      .eq("id", id)
      .select()
      .single();
  },

  delete: async (id: string) => {
    return await supabase.from(table).delete().eq("id", id);
  },
});

/* =========================================
   CHILD TABLE EXPORTS
========================================= */

export const ActivitiesAPI = createChildAPI("activities");
export const FoodAPI = createChildAPI("food");
export const AccommodationAPI = createChildAPI("accommodation");
export const UserAPI = createChildAPI("profile")