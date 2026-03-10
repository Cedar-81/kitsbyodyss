import { useEffect } from "react";
import { supabase } from "./utils/supabase";
import Navbar from "./components/navbar";
import { Outlet } from "react-router-dom";
import { useUserStore } from "./utils/store/app_store";

export default function ProfileLayout() {
  const { user, setUser } = useUserStore();
    
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user as any ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setUser]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* NAVBAR */}
      <Navbar user={user} />

      {/* PAGE CONTENT */}
      <main className="flex-1 flex">
        <Outlet />
      </main>

    </div>
  )
}
