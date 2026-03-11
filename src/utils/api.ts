import { supabase } from "./supabase";

 
export const handleGoogleLogin = async (pathname: string) => {
    localStorage.setItem("kits_by_odyss_current_url", pathname)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:  window.location.origin,
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
      .eq("user_id", user_id)
      .single();
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

export const UserAPI = {
  ...createChildAPI("profile"),

  addPurchasedKitUnique: async (userId: string, kitId: string) => {
    // 1. Fetch current data
    const { data: profile, error: fetchError } = await supabase
      .from("profile")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError) return { data: null, error: fetchError };

    const currentKits = profile.purchased_kits || [];
    const updatedKitsSet = new Set([...currentKits, kitId]);
    
    console.log("profile: ", profile)
    
    // 2. Perform Update
    // Note: We use profile.id here to match your standard 'update' pattern
    const { data, error: updateError } = await supabase
      .from("profile")
      .update({ purchased_kits: Array.from(updatedKitsSet) })
      .eq("id", profile.id) // Use the primary key 'id' instead of 'user_id'
      .select()
      .single();

    return { data, error: updateError };
  }

};


export const ActivitiesAPI = createChildAPI("activities");
export const FoodAPI = createChildAPI("food");
export const AccommodationAPI = createChildAPI("accommodation");
