import { useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import {
    addToast,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Modal,
    ModalContent,
    useDisclosure,
    User,
} from "@heroui/react";
import { handleGoogleLogin, handleGoogleLogout, UserAPI } from "../utils/api";
import UserInfo from "./user_info";
import { useProfileStore, useUserStore } from "../utils/store/app_store";
import KitsLogo from "./kits_logo";

type NavTab = {
    label: string;
    path: string;
    matchPaths?: string[];
};

export default function Navbar({ user }: { user: any }) {
    const { id, user_id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { profile, setProfile, populateProfileForm, setCurrentProfileId, setIsUpdating } = useProfileStore();
    const { showLogin, setShowLogin } = useUserStore()

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const tabs: NavTab[] = [
        { label: "Overview", path: `/${user_id}/${id}/overview` },
        { label: "Transportation", path: `/${user_id}/${id}/transportation`, matchPaths: [`/${user_id}/${id}/new-transportation`] },
        { label: "Food", path: `/${user_id}/${id}/food`, matchPaths: [`/${user_id}/${id}/new-food`] },
        { label: "Activities", path: `/${user_id}/${id}/activities`, matchPaths: [`/${user_id}/${id}/new-activity`] },
        { label: "Accommodation", path: `/${user_id}/${id}/accommodation`, matchPaths: [`/${user_id}/${id}/new-accommodation`] },
    ];

    const isTabActive = (tab: NavTab) =>
        location.pathname === tab.path || tab.matchPaths?.includes(location.pathname);

    const tabClass = (tab: NavTab, extraClass = "") =>
        `w-full h-11 text-sm flex items-center justify-center ${extraClass} ${
            isTabActive(tab) ? "border-b-2 border-b-brand text-black" : "text-black/70"
        }`;

    const hideTabNav =
        location.pathname === `/` ||
        location.pathname.includes("overview") ||
        location.pathname.includes("profile") ||
        location.pathname.includes("new-kit")

    const handleEdit = () => {
        if (profile?.id) {
            populateProfileForm({
                username: profile.username,
                display_name: profile.display_name,
                user_id: profile.user_id,
                id: profile.id,
            });
            setCurrentProfileId(profile.id);
            setIsUpdating(true);
        }
    };

    useEffect(() => {
        // If no user, clear the profile and exit
        if (!user) {
            setProfile(null);
            return;
        }

        // Only run if we have a user but the profile doesn't match the current user_id
        if (profile && profile.user_id === user.id) return;

        const generateUser = async () => {
            const { data: profileData, error } = await UserAPI.getByUserId(user.id);

            if (error && error.code !== "PGRST116") { // Supabase returns 406 if no row found
                console.error("Error fetching profile:", error);
                return;
            }

            console.log("gotten profile: ", profileData);

            if (profileData) {
                // Profile exists → set state
                setProfile({
                    ...profileData
                });
                return;
            }

            // No profile exists → create one
            const res = await fetch("https://randomuser.me/api/");
            const data = await res.json();
            const username = data.results[0].login.username;

            const { data: newUser, error: createError } = await UserAPI.create({
                user_id: user.id,
                username,
                display_name: user.user_metadata.full_name,
            });

            if (createError) {
                console.error(createError);
                addToast({ title: "Couldn't add user info", color: "danger" });
            } else if (newUser) {
                setProfile(newUser); // should match the correct user_id
            }
        };

    generateUser();
    }, [user]);


    const not_home = location.pathname !== "" && location.pathname !== "/"

    useEffect(() => {
        if(not_home && !user) {
            setShowLogin(true)
        }
    }, [user])


    return (
        <nav className="h-20 relative">
            {/* Sign-in gate */}
            {showLogin && (
                <div onClick={() => {
                    if(not_home) return
                    setShowLogin(false)
                }} className="fixed top-0 right-0 h-screen flex items-center justify-center p-8 w-full bg-black/70 z-50">
                    <div className="w-full p-6 md:w-100 rounded-2xl bg-white space-y-5 border border-brand/70">
                        <h1 className="text-xl font-semibold">Please sign in to continue</h1>
                        <Button onPress={() => {   
                            handleGoogleLogin(location.pathname)}} variant="bordered" className="w-full border-brand text-brand">
                            Continue with Google
                        </Button>
                    </div>
                </div>
            )}

            {/* Edit profile modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => <UserInfo onClose={onClose} />}
                </ModalContent>
            </Modal>

            {/* Top bar */}
            <div className="flex justify-between items-center w-full border-b navbar border-black/20 h-20 z-40 fixed backdrop-blur-3xl top-0 right-0 px-5 md:px-10">
                <Link to={"/"}> <KitsLogo /> </Link>

                <div> 
                    {!user ? (
                        <Button onPress={() => handleGoogleLogin(location.pathname)} variant="bordered" className="border-brand login-btn text-brand">
                            Continue with Google
                        </Button>
                    ) : (
                        <Dropdown>
                            <DropdownTrigger>
                                <div className="size-9 cursor-pointer border-2 border-brand rounded-full relative bg-brand overflow-hidden">
                                    <img src={user.user_metadata.avatar_url} alt="User Avatar" className="rounded-full h-full w-full object-cover absolute" />
                                </div>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="User menu">
                                <DropdownItem key="info">
                                    <User
                                        avatarProps={{ src: user.user_metadata.avatar_url }}
                                        description={profile?.username}
                                        name={profile?.display_name}
                                    />
                                </DropdownItem>
                                <DropdownItem key="your_kits" onClick={() => navigate(`/${user.id}/profile`)}>
                                    My kits
                                </DropdownItem>
                                <DropdownItem key="set_info" onClick={() => { handleEdit(); onOpen(); }}>
                                    Edit profile
                                </DropdownItem>
                                <DropdownItem key="logout" onClick={handleGoogleLogout} className="text-danger" color="danger">
                                    Logout
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    )}
                </div>
            </div>

            {/* Tab navigation */}
            {!hideTabNav && (
                <>
                    {/* Mobile */}
                    <div className="block text-center lg:hidden bg-white z-10">
                        <Link to={tabs[0].path} className={tabClass(tabs[0], "border border-black/20 border-b-0")}>
                            Overview
                        </Link>
                        <div className="flex">
                            {tabs.slice(1, 3).map((tab) => (
                                <Link key={tab.label} to={tab.path} className={tabClass(tab, "border border-black/20 first:border-r-0 border-b-0 last:border-l-1")}>
                                    {tab.label}
                                </Link>
                            ))}
                        </div>
                        <div className="flex">
                            {tabs.slice(3).map((tab) => (
                                <Link key={tab.label} to={tab.path} className={tabClass(tab, "border border-black/20 last:border-l-0")}>
                                    {tab.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Desktop */}
                    <div className="hidden lg:flex text-center border-b border-b-black/20 z-10 w-1/2 mx-auto">
                        {tabs.map((tab) => (
                            <Link key={tab.label} to={tab.path} className={tabClass(tab)}>
                                {tab.label}
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </nav>
    );
}