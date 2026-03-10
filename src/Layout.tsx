import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar";
import { useEffect } from "react";
import { supabase } from "./utils/supabase";
import { useUserStore } from "./utils/store/app_store";

const Layout = () => {
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
      {/* create a modal here prompting user to sign in with google is user is not availaible */}
      
      {/* NAVBAR */}
      <Navbar user={user} />

      {/* PAGE CONTENT */}
      <main className="flex-1 flex">
        <Outlet />
      </main>

    </div>
  );
};

export default Layout;